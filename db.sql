CREATE DATABASE "HRM";
-- Make sure subsequent statements execute in the newly created HRM database
\connect "HRM"
-- Xóa các bảng cũ nếu tồn tại (để reset demo)
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
DROP VIEW IF EXISTS view_fulltime_payslip_detail;

-- Tạo các kiểu ENUM cho các trường có giá trị cố định (dựa trên ERD)
CREATE TYPE gender_enum AS ENUM ('Male', 'Female', 'Other');
CREATE TYPE emp_status_enum AS ENUM ('Active', 'Inactive', 'Resigned');
CREATE TYPE emp_type_enum AS ENUM ('Fulltime', 'Freelance');
CREATE TYPE contract_type_enum AS ENUM ('Definite', 'Indefinite');
CREATE TYPE payroll_status_enum AS ENUM ('Paid', 'Unpaid');
CREATE TYPE day_of_week_enum AS ENUM ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');

-- 1. Bảng EMPLOYEE_ACCOUNT (Bảng gốc chứa thông tin nhân viên)
CREATE TABLE employee_account (
    id SERIAL PRIMARY KEY,
    f_name VARCHAR(50) NOT NULL,
    m_name VARCHAR(50),
    l_name VARCHAR(50) NOT NULL,
    -- Use text for these columns so application (JPA entity) that expects text binds correctly
    sex text,
    phone VARCHAR(20),
    email VARCHAR(100) UNIQUE NOT NULL,
    bank_account_number VARCHAR(50),
    address TEXT,
    dob DATE,
    type text NOT NULL, -- Phân loại Fulltime/Freelance
    status text DEFAULT 'Active',
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL 
);

-- 2. Bảng HR (Kế thừa ID từ Employee, quan hệ 1-1)
CREATE TABLE hr (
    id INT PRIMARY KEY REFERENCES employee_account(id),
    permission_level VARCHAR(50) DEFAULT 'Staff' 
);

-- 3. FULLTIME CONTRACT
CREATE TABLE fulltime_contract (
    contract_id SERIAL PRIMARY KEY,
    employee_id INT NOT NULL REFERENCES employee_account(id),
    start_date DATE NOT NULL,
    end_date DATE, -- Có thể null nếu là vô thời hạn
    base_salary DECIMAL(15, 2) NOT NULL,
    ot_rate DECIMAL(5, 2) DEFAULT 1.5,
    annual_leave_days INT DEFAULT 12,
    type text NOT NULL -- Definite/Indefinite (stored as text to match application mapping)
);

-- Các bảng chi tiết của Fulltime Contract (Phụ cấp, Thưởng quy định, Khấu trừ, Ngày làm việc)
CREATE TABLE fulltime_contract_allowance (
    contract_id INT REFERENCES fulltime_contract(contract_id),
    stt INT, -- Số thứ tự
    name VARCHAR(100),
    amount DECIMAL(15, 2),
    PRIMARY KEY (contract_id, stt)
);

CREATE TABLE fulltime_contract_bonus (
    contract_id INT REFERENCES fulltime_contract(contract_id),
    stt INT,
    name VARCHAR(100),
    amount DECIMAL(15, 2),
    rate DECIMAL(5, 2), -- Nếu tính theo tỷ lệ
    PRIMARY KEY (contract_id, stt)
);

CREATE TABLE fulltime_contract_deduction (
    contract_id INT REFERENCES fulltime_contract(contract_id),
    stt INT,
    name VARCHAR(100),
    amount DECIMAL(15, 2),
    rate DECIMAL(5, 2),
    PRIMARY KEY (contract_id, stt)
);

CREATE TABLE fulltime_contract_workday (
    contract_id INT REFERENCES fulltime_contract(contract_id),
    day day_of_week_enum,
    start_at TIME,
    end_at TIME,
    PRIMARY KEY (contract_id, day)
);

-- 4. FREELANCE CONTRACT
CREATE TABLE freelance_contract (
    contract_id SERIAL PRIMARY KEY,
    employee_id INT NOT NULL REFERENCES employee_account(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    value DECIMAL(15, 2) NOT NULL, -- Tổng giá trị hợp đồng
    committed_deadline DATE
);

CREATE TABLE freelance_contract_bonus (
    contract_id INT REFERENCES freelance_contract(contract_id),
    stt INT,
    name VARCHAR(100),
    amount DECIMAL(15, 2),
    rate DECIMAL(5, 2),
    PRIMARY KEY (contract_id, stt)
);

CREATE TABLE freelance_contract_penalty (
    contract_id INT REFERENCES freelance_contract(contract_id),
    stt INT,
    name VARCHAR(100),
    amount DECIMAL(15, 2),
    rate DECIMAL(5, 2),
    PRIMARY KEY (contract_id, stt)
);
-- 5. TIMESHEET
CREATE TABLE timesheet (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    checkin_time TIMESTAMP,
    checkout_time TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    employee_id INT NOT NULL REFERENCES employee_account(id)
);

-- 6. LEAVE REQUEST
CREATE TABLE leave_request (
    id SERIAL PRIMARY KEY,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    leave_type VARCHAR(50), -- Ví dụ: Sick, Annual, Unpaid
    reason TEXT,
    is_approved BOOLEAN DEFAULT NULL, -- NULL: Pending, TRUE: Approved, FALSE: Rejected
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    employee_create INT NOT NULL REFERENCES employee_account(id),
    hr_approve INT REFERENCES hr(id) -- Người duyệt
);

-- 7. LEAVE REQUEST CANCEL (Yêu cầu hủy phép)
CREATE TABLE leave_request_cancel (
    leave_request_id INT PRIMARY KEY REFERENCES leave_request(id),
    employee_id INT NOT NULL REFERENCES employee_account(id) -- Người yêu cầu hủy
);
-- 8. PAYROLL (Kỳ lương)
CREATE TABLE payroll (
    id SERIAL PRIMARY KEY,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    month INT NOT NULL,
    year INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status payroll_status_enum DEFAULT 'Unpaid',
    hr_approve INT REFERENCES hr(id),
    is_approved BOOLEAN DEFAULT FALSE
);

-- 9. FULLTIME PAYSLIP (Phiếu lương Fulltime thực tế)
CREATE TABLE fulltime_payslip (
    payslip_id SERIAL PRIMARY KEY,
    payroll_id INT NOT NULL REFERENCES payroll(id),
    employee_id INT NOT NULL REFERENCES employee_account(id),
    contract_id INT NOT NULL REFERENCES fulltime_contract(contract_id),
    net_salary DECIMAL(15, 2),
    gross_salary DECIMAL(15, 2)
);

-- Chi tiết lương thực nhận Fulltime
CREATE TABLE fulltime_actual_allowance (
    payslip_id INT REFERENCES fulltime_payslip(payslip_id),
    stt INT,
    name VARCHAR(100),
    amount DECIMAL(15, 2),
    PRIMARY KEY (payslip_id, stt)
);

CREATE TABLE fulltime_actual_bonus (
    payslip_id INT REFERENCES fulltime_payslip(payslip_id),
    stt INT,
    name VARCHAR(100),
    amount DECIMAL(15, 2),
    PRIMARY KEY (payslip_id, stt)
);

CREATE TABLE fulltime_payslip_deduction (
    payslip_id INT REFERENCES fulltime_payslip(payslip_id),
    stt INT,
    name VARCHAR(100),
    amount DECIMAL(15, 2),
    PRIMARY KEY (payslip_id, stt)
);

-- 10. FREELANCE PAYSLIP (Phiếu lương Freelance thực tế)
CREATE TABLE freelance_payslip (
    payslip_id SERIAL PRIMARY KEY,
    payroll_id INT NOT NULL REFERENCES payroll(id),
    employee_id INT NOT NULL REFERENCES employee_account(id),
    contract_id INT NOT NULL REFERENCES freelance_contract(contract_id),
    final_amount DECIMAL(15, 2)
);

CREATE TABLE freelance_actual_penalty (
    payslip_id INT REFERENCES freelance_payslip(payslip_id),
    stt INT,
    name VARCHAR(100),
    amount DECIMAL(15, 2),
    PRIMARY KEY (payslip_id, stt)
);

CREATE TABLE freelance_actual_bonus (
    payslip_id INT REFERENCES freelance_payslip(payslip_id),
    stt INT,
    name VARCHAR(100),
    amount DECIMAL(15, 2),
    PRIMARY KEY (payslip_id, stt)
);

ALTER TABLE fulltime_contract 
ADD CONSTRAINT chk_fulltime_dates CHECK (start_date < end_date OR end_date IS NULL),
ADD CONSTRAINT chk_base_salary_positive CHECK (base_salary > 0),
ADD CONSTRAINT chk_ot_rate_positive CHECK (ot_rate > 0),
ADD CONSTRAINT chk_annual_leave CHECK (annual_leave_days >= 0);

ALTER TABLE freelance_contract
ADD CONSTRAINT chk_freelance_dates CHECK (start_date < end_date),
ADD CONSTRAINT chk_contract_value_positive CHECK (value > 0);

ALTER TABLE leave_request
ADD CONSTRAINT chk_leave_dates CHECK (start_date <= end_date);

-- Add indexes for performance
CREATE INDEX idx_employee_status ON employee_account(status);
CREATE INDEX idx_employee_type ON employee_account(type);
CREATE INDEX idx_fulltime_employee ON fulltime_contract(employee_id);
CREATE INDEX idx_freelance_employee ON freelance_contract(employee_id);
CREATE INDEX idx_timesheet_employee_date ON timesheet(employee_id, date);
CREATE INDEX idx_leave_request_employee ON leave_request(employee_create);
CREATE INDEX idx_payroll_period ON payroll(year, month);

-- Improve LEAVE_REQUEST_CANCEL table
ALTER TABLE leave_request_cancel
ADD COLUMN cancelled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN hr_approve INT REFERENCES hr(id),
ADD COLUMN reason TEXT;

-- ============================================
-- COMPREHENSIVE DUMMY DATA
-- ============================================

-- 1. Insert Employees (3 Fulltime, 2 Freelance)
INSERT INTO employee_account (f_name, m_name, l_name, sex, phone, email, bank_account_number, address, dob, type, status, username, password) VALUES
('John', 'Michael', 'Smith', 'Male', '+84901234567', 'john.smith@company.com', '1234567890', '123 Nguyen Hue St, District 1, HCMC', '1990-05-15', 'Fulltime', 'Active', 'jsmith', 'hashed_password_123'),
('Sarah', 'Jane', 'Johnson', 'Female', '+84901234568', 'sarah.johnson@company.com', '1234567891', '456 Le Loi St, District 1, HCMC', '1992-08-22', 'Fulltime', 'Active', 'sjohnson', 'hashed_password_456'),
('Michael', NULL, 'Brown', 'Male', '+84901234569', 'michael.brown@company.com', '1234567892', '789 Hai Ba Trung St, District 3, HCMC', '1988-03-10', 'Fulltime', 'Active', 'mbrown', 'hashed_password_789'),
('Emily', 'Rose', 'Davis', 'Female', '+84901234570', 'emily.davis@company.com', '1234567893', '321 Tran Hung Dao St, District 5, HCMC', '1995-11-30', 'Freelance', 'Active', 'edavis', 'hashed_password_101'),
('David', 'Lee', 'Wilson', 'Male', '+84901234571', 'david.wilson@company.com', '1234567894', '654 Pham Ngu Lao St, District 1, HCMC', '1993-07-18', 'Freelance', 'Active', 'dwilson', 'hashed_password_202');

-- 2. Insert HR (John Smith is HR Manager, Sarah is HR Staff)
INSERT INTO hr (id, permission_level) VALUES
(1, 'Manager'),
(2, 'Staff');

-- 3. Insert Fulltime Contracts
INSERT INTO fulltime_contract (employee_id, start_date, end_date, base_salary, ot_rate, annual_leave_days, type) VALUES
(1, '2023-01-01', NULL, 29000000.00, 1.5, 15, 'Indefinite'),
(2, '2023-03-01', NULL, 22000000.00, 1.5, 12, 'Indefinite'),
(3, '2024-01-01', '2025-12-31', 30000000.00, 2.0, 12, 'Definite');

-- 4. Fulltime Contract Details (Allowances)
INSERT INTO fulltime_contract_allowance (contract_id, stt, name, amount) VALUES
(1, 1, 'Responsibility Allowance', 2000000.00),
(1, 2, 'Living Allowance', 1000000.00),
(2, 1, 'Travel Allowance', 1400000.00),
(3, 1, 'Responsibility Allowance', 3000000.00),
(3, 2, 'Travel Allowance', 2000000.00);

-- 5. Fulltime Contract Bonus
-- INSERT INTO fulltime_contract_bonus (contract_id, stt, name, amount, rate) VALUES
-- (1, 1, 'Other Bonus', NULL, 10.00),
-- (2, 1, 'Quarterly Bonus', 2000000.00, NULL),
-- (3, 1, 'Annual Bonus', NULL, 15.00);

-- 6. Fulltime Contract Deduction
INSERT INTO fulltime_contract_deduction (contract_id, stt, name, amount, rate) VALUES
(1, 1, 'Social Insurance', NULL, 8.00),
(1, 2, 'Health Insurance', NULL, 1.50),
(1, 3, 'Accident Insurance', NULL, 1.00),
(2, 1, 'Social Insurance', NULL, 8.00),
(2, 2, 'Health Insurance', NULL, 1.50),
(2, 3, 'Accident Insurance', NULL, 1.00),
(3, 1, 'Social Insurance', NULL, 8.00),
(3, 2, 'Health Insurance', NULL, 1.50),
(3, 3, 'Accident Insurance', NULL, 1.00);

-- 7. Fulltime Contract Workday
INSERT INTO fulltime_contract_workday (contract_id, day, start_at, end_at) VALUES
(1, 'Monday', '08:00', '17:00'),
(1, 'Tuesday', '08:00', '17:00'),
(1, 'Wednesday', '08:00', '17:00'),
(1, 'Thursday', '08:00', '17:00'),
(1, 'Friday', '08:00', '17:00'),
(2, 'Monday', '09:00', '18:00'),
(2, 'Tuesday', '09:00', '18:00'),
(2, 'Wednesday', '09:00', '18:00'),
(2, 'Thursday', '09:00', '18:00'),
(2, 'Friday', '09:00', '18:00'),
(3, 'Monday', '08:30', '17:30'),
(3, 'Tuesday', '08:30', '17:30'),
(3, 'Wednesday', '08:30', '17:30'),
(3, 'Thursday', '08:30', '17:30'),
(3, 'Friday', '08:30', '17:30');

-- 8. Freelance Contracts
INSERT INTO freelance_contract (employee_id, start_date, end_date, value, committed_deadline) VALUES
(4, '2024-01-15', '2024-06-30', 90000000.00, '2024-06-15'),
(5, '2024-03-01', '2024-12-31', 80000000.00, '2024-11-30');

-- 9. Freelance Contract Bonus
INSERT INTO freelance_contract_bonus (contract_id, stt, name, amount, rate) VALUES
(1, 1, 'Early Completion Bonus', 9000000.00, NULL),
(2, 1, 'Quality Bonus', NULL, 10.00);

-- 10. Freelance Contract Penalty
INSERT INTO freelance_contract_penalty (contract_id, stt, name, amount, rate) VALUES
(1, 1, 'Late Delivery Penalty', NULL, 5.00),
(2, 1, 'Quality Issue Penalty', 3000000.00, NULL);

-- 11. Timesheet (November 2024 data)
INSERT INTO timesheet (date, checkin_time, checkout_time, employee_id) VALUES
('2024-11-18', '2024-11-18 08:05:00', '2024-11-18 17:10:00', 1),
('2024-11-18', '2024-11-18 08:55:00', '2024-11-18 18:05:00', 2),
('2024-11-18', '2024-11-18 08:30:00', '2024-11-18 17:35:00', 3),
('2024-11-19', '2024-11-19 08:00:00', '2024-11-19 17:05:00', 1),
('2024-11-19', '2024-11-19 09:10:00', '2024-11-19 18:00:00', 2),
('2024-11-19', '2024-11-19 08:25:00', '2024-11-19 19:00:00', 3),
('2024-11-20', '2024-11-20 08:10:00', '2024-11-20 17:15:00', 1),
('2024-11-20', '2024-11-20 09:00:00', '2024-11-20 18:10:00', 2),
('2024-11-21', '2024-11-21 08:00:00', '2024-11-21 17:00:00', 1),
('2024-11-21', '2024-11-21 09:05:00', '2024-11-21 18:00:00', 2);

-- 12. Leave Requests
INSERT INTO leave_request (start_date, end_date, leave_type, reason, is_approved, employee_create, hr_approve) VALUES
('2024-11-25', '2024-11-27', 'Annual', 'Family vacation', TRUE, 1, 1),
('2024-12-02', '2024-12-02', 'Sick', 'Medical appointment', TRUE, 2, 1),
('2024-12-10', '2024-12-15', 'Annual', 'Year-end holiday', NULL, 3, NULL),
('2024-11-22', '2024-11-22', 'Unpaid', 'Personal matters', FALSE, 2, 1);

-- 13. Leave Request Cancel
INSERT INTO leave_request_cancel (leave_request_id, employee_id) VALUES
(1, 1);

-- 14. Payroll (November 2024)
INSERT INTO payroll (period_start, period_end, month, year, status, hr_approve, is_approved) VALUES
('2024-11-01', '2024-11-30', 11, 2024, 'Unpaid', 1, TRUE);

-- 15. Fulltime Payslip
INSERT INTO fulltime_payslip (payroll_id, employee_id, contract_id, net_salary, gross_salary) VALUES
(1, 1, 1, 24900000.00, 27900000.00),
(1, 2, 2, 22000000.00, 25900000.00),
(1, 3, 3, 31900000.00, 39000000.00);

-- 16. Fulltime Actual Allowance
INSERT INTO fulltime_actual_allowance (payslip_id, stt, name, amount) VALUES
(1, 1, 'Transportation Allowance', 1900000.00),
(1, 2, 'Meal Allowance', 1000000.00),
(2, 1, 'Transportation Allowance', 1900000.00),
(3, 1, 'Housing Allowance', 3000000.00),
(3, 2, 'Transportation Allowance', 2000000.00);

-- 17. Fulltime Actual Bonus
INSERT INTO fulltime_actual_bonus (payslip_id, stt, name, amount) VALUES
(1, 1, 'Performance Bonus', 2900000.00),
(2, 1, 'Quarterly Bonus', 2000000.00),
(3, 1, 'Annual Bonus', 4900000.00);

-- 18. Fulltime Payslip Deduction
INSERT INTO fulltime_payslip_deduction (payslip_id, stt, name, amount) VALUES
(1, 1, 'Social Insurance', 2200000.00),
(1, 2, 'Health Insurance', 412500.00),
(1, 3, 'Unemployment Insurance', 279000.00),
(2, 1, 'Social Insurance', 2040000.00),
(2, 2, 'Health Insurance', 382500.00),
(3, 1, 'Social Insurance', 2800000.00);

-- 19. Freelance Payslip
INSERT INTO freelance_payslip (payroll_id, employee_id, contract_id, final_amount) VALUES
(1, 4, 1, 28000000.00),
(1, 5, 2, 49000000.00);

-- 20. Freelance Actual Bonus
INSERT INTO freelance_actual_bonus (payslip_id, stt, name, amount) VALUES
(1, 1, 'Early Completion Bonus', 9000000.00),
(2, 1, 'Quality Bonus', 8000000.00);

-- 21. Freelance Actual Penalty
INSERT INTO freelance_actual_penalty (payslip_id, stt, name, amount) VALUES
(1, 1, 'Late Delivery Penalty', 2000000.00);

ALTER TABLE fulltime_contract 
ADD COLUMN document_path VARCHAR(500);

ALTER TABLE freelance_contract 
ADD COLUMN document_path VARCHAR(500);

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check all employees and their contracts
SELECT 
    ea.id,
    ea.f_name || ' ' || ea.l_name as full_name,
    ea.type,
    ea.status,
    CASE 
        WHEN ea.type = 'Fulltime' THEN fc.contract_id::TEXT
        ELSE flc.contract_id::TEXT
    END as contract_id
FROM employee_account ea
LEFT JOIN fulltime_contract fc ON ea.id = fc.employee_id
LEFT JOIN freelance_contract flc ON ea.id = flc.employee_id;

-- Check payroll summary
SELECT 
    p.id as payroll_id,
    p.month,
    p.year,
    p.status,
    COUNT(DISTINCT fps.payslip_id) as fulltime_count,
    COUNT(DISTINCT flps.payslip_id) as freelance_count,
    SUM(fps.net_salary) as total_fulltime,
    SUM(flps.final_amount) as total_freelance
FROM payroll p
LEFT JOIN fulltime_payslip fps ON p.id = fps.payroll_id
LEFT JOIN freelance_payslip flps ON p.id = flps.payroll_id
GROUP BY p.id, p.month, p.year, p.status;


CREATE OR REPLACE PROCEDURE sp_generate_fulltime_payslip(
    p_payroll_id INT,
    p_employee_id INT,
    p_actual_work_days INT,
    p_ot_hours DECIMAL(15, 2),
    p_manual_bonus JSONB DEFAULT '{}'::JSONB
)
LANGUAGE plpgsql
AS $$
DECLARE
    -- Hằng số & Biến (Giữ nguyên như cũ)
    WORK_DAYS_STANDARD CONSTANT INT := 26;
    HOURS_STANDARD_DAY CONSTANT INT := 8;
    HOURS_STANDARD_MONTH CONSTANT INT := WORK_DAYS_STANDARD * HOURS_STANDARD_DAY;
    SELF_DEDUCTION CONSTANT DECIMAL(15, 2) := 11000000.00;
    TAX_RATE CONSTANT DECIMAL(5, 2) := 0.1;

    -- Biến kiểm tra status
    v_payroll_status payroll_status_enum;
    
    -- Các biến tính toán (Giữ nguyên)
    v_contract_id INT;
    v_base_salary DECIMAL(15, 2);
    v_payslip_id INT;
    v_responsibility_allowance DECIMAL(15, 2) := 0; 
    v_living_allowance DECIMAL(15, 2) := 0; 
    v_travel_allowance DECIMAL(15, 2) := 0;
    v_holiday_bonus DECIMAL(15, 2) := 0;
    v_other_bonus DECIMAL(15, 2) := 0;
    v_ot_rate DECIMAL(15, 2) := 0;
    v_ot_amount DECIMAL(15, 2) := 0;
    v_total_taxed_allowance DECIMAL(15, 2); 
    v_total_bonus DECIMAL(15, 2);
    v_contract_gross DECIMAL(15, 2);
    v_salary_by_workday DECIMAL(15, 2); 
    v_actual_gross_income DECIMAL(15, 2);
    v_bhxh DECIMAL(15, 2);
    v_bhyt DECIMAL(15, 2);
    v_bhtn DECIMAL(15, 2);
    v_total_statutory_deduction DECIMAL(15, 2);
    v_other_deduction DECIMAL(15, 2);
    v_taxable_income DECIMAL(15, 2); 
    v_tax DECIMAL(15, 2);            
    v_net_income DECIMAL(15, 2);     

BEGIN
    -- [MỚI] 1. CHECK STATUS (LOCK MECHANISM)
    SELECT status INTO v_payroll_status FROM payroll WHERE id = p_payroll_id;
    
    IF v_payroll_status = 'Paid' THEN
        RAISE EXCEPTION 'PAYROLL_LOCKED: Kỳ lương này đã được thanh toán (Paid). Không thể tính lại.';
    END IF;

    -- (Phần logic tính toán giữ nguyên như code bạn cung cấp)
    RAISE NOTICE '>>> START CALC: EmpID %, WorkDays %', p_employee_id, p_actual_work_days;

    SELECT contract_id, base_salary, ot_rate
    INTO v_contract_id, v_base_salary, v_ot_rate
    FROM fulltime_contract
    WHERE employee_id = p_employee_id
    ORDER BY start_date DESC LIMIT 1;

    IF v_contract_id IS NULL THEN
        RAISE NOTICE 'No active fulltime contract found for Employee ID %', p_employee_id;
        RETURN;
    END IF;

    SELECT COALESCE(SUM(CASE WHEN name = 'Responsibility Allowance' THEN amount ELSE 0 END), 0),
           COALESCE(SUM(CASE WHEN name = 'Living Allowance' THEN amount ELSE 0 END), 0),
           COALESCE(SUM(CASE WHEN name = 'Travel Allowance' THEN amount ELSE 0 END), 0)
    INTO v_responsibility_allowance, v_living_allowance, v_travel_allowance
    FROM fulltime_contract_allowance
    WHERE contract_id = v_contract_id;

    -- [Mapping Input] Phần này map với Dropdown của FE
    IF p_manual_bonus IS NOT NULL THEN
        v_holiday_bonus := COALESCE((p_manual_bonus->>'holiday')::DECIMAL, 0);
        v_other_bonus := COALESCE((p_manual_bonus->>'other')::DECIMAL, 0);
    END IF;

    IF p_ot_hours > 0 AND v_ot_rate IS NOT NULL THEN
        v_ot_amount := (v_base_salary / HOURS_STANDARD_MONTH) * p_ot_hours * v_ot_rate;
    END IF;

    v_total_taxed_allowance := v_responsibility_allowance + v_living_allowance;
    v_total_bonus := v_holiday_bonus + v_other_bonus;
    v_contract_gross := v_base_salary + v_total_taxed_allowance;
    v_salary_by_workday := (v_contract_gross / WORK_DAYS_STANDARD) * p_actual_work_days;
    v_actual_gross_income := v_salary_by_workday + v_total_bonus + v_ot_amount + v_travel_allowance;

    SELECT COALESCE(SUM(CASE WHEN name = 'Social Insurance' THEN (v_base_salary * rate / 100.0) ELSE 0 END), 0),
           COALESCE(SUM(CASE WHEN name = 'Health Insurance' THEN (v_base_salary * rate / 100.0) ELSE 0 END), 0),
           COALESCE(SUM(CASE WHEN name = 'Accident Insurance' THEN (v_base_salary * rate / 100.0) ELSE 0 END), 0),
           COALESCE(SUM(CASE WHEN name = 'Other Deduction' THEN amount ELSE 0 END), 0)
    INTO v_bhxh, v_bhyt, v_bhtn, v_other_deduction
    FROM fulltime_contract_deduction
    WHERE contract_id = v_contract_id;
    
    v_total_statutory_deduction := v_bhxh + v_bhyt + v_bhtn;
    v_taxable_income := GREATEST(0, v_actual_gross_income - v_travel_allowance - v_ot_amount - v_total_statutory_deduction - SELF_DEDUCTION - v_other_deduction);
    v_tax := v_taxable_income * TAX_RATE;

    IF p_actual_work_days = 0 THEN
        v_actual_gross_income := 0;
        v_total_statutory_deduction := 0;
        v_tax := 0;
        v_net_income := 0;
    ELSE
        v_net_income := v_actual_gross_income - v_total_statutory_deduction - v_tax;
    END IF;

    -- [DELETE CŨ - LOGIC RESET]
    DELETE FROM fulltime_actual_allowance 
    WHERE payslip_id IN (SELECT payslip_id FROM fulltime_payslip WHERE payroll_id = p_payroll_id AND employee_id = p_employee_id);
    DELETE FROM fulltime_actual_bonus 
    WHERE payslip_id IN (SELECT payslip_id FROM fulltime_payslip WHERE payroll_id = p_payroll_id AND employee_id = p_employee_id);
    DELETE FROM fulltime_payslip_deduction 
    WHERE payslip_id IN (SELECT payslip_id FROM fulltime_payslip WHERE payroll_id = p_payroll_id AND employee_id = p_employee_id);
    DELETE FROM fulltime_payslip WHERE payroll_id = p_payroll_id AND employee_id = p_employee_id;

    -- [INSERT MỚI]
    INSERT INTO fulltime_payslip (payroll_id, employee_id, contract_id, gross_salary, net_salary)
    VALUES (p_payroll_id, p_employee_id, v_contract_id, v_actual_gross_income, v_net_income)
    RETURNING payslip_id INTO v_payslip_id;

    INSERT INTO fulltime_actual_allowance (payslip_id, stt, name, amount) VALUES
    (v_payslip_id, 1, 'Responsibility Allowance', COALESCE(v_responsibility_allowance, 0)),
    (v_payslip_id, 2, 'Living Allowance', COALESCE(v_living_allowance, 0)),
    (v_payslip_id, 3, 'Travel Allowance', COALESCE(v_travel_allowance, 0));

    INSERT INTO fulltime_actual_bonus (payslip_id, stt, name, amount) VALUES
    (v_payslip_id, 1, 'Holiday Bonus', COALESCE(v_holiday_bonus, 0)),
    (v_payslip_id, 2, 'Other Bonus', COALESCE(v_other_bonus, 0)),
    (v_payslip_id, 3, 'Overtime Payment', v_ot_amount);

    INSERT INTO fulltime_payslip_deduction (payslip_id, stt, name, amount) VALUES
    (v_payslip_id, 1, 'Self Deduction (TNCN)', SELF_DEDUCTION),
    (v_payslip_id, 2, 'BHXH (8%)', v_bhxh),
    (v_payslip_id, 3, 'BHYT (1.5%)', v_bhyt),
    (v_payslip_id, 4, 'BHTN (1%)', v_bhtn),
    (v_payslip_id, 5, 'Khấu trừ khác', v_other_deduction),
    (v_payslip_id, 6, 'Thuế TNCN (10%)', v_tax);

    RAISE NOTICE 'SUCCESS: Payslip ID % Generated.', v_payslip_id;
END;
$$;

CREATE OR REPLACE VIEW view_fulltime_payslip_detail AS
SELECT 
    fp.payslip_id,
    fp.payroll_id, -- Thêm cái này để dễ filter theo kỳ lương
    fp.employee_id,
    e.f_name || ' ' || e.l_name as full_name,
    e.bank_account_number,
    fp.gross_salary,
    fp.net_salary,
    -- Gom nhóm Allowances thành JSON Text
    COALESCE(
        (
            SELECT JSON_AGG(json_build_object('name', fa.name, 'amount', fa.amount))
            FROM fulltime_actual_allowance fa 
            WHERE fa.payslip_id = fp.payslip_id
        ), 
        '[]'::json
    )::text as allowances_json, -- Cast về text để Java hứng dưới dạng String
    
    -- Gom nhóm Bonuses thành JSON Text
    COALESCE(
        (
            SELECT JSON_AGG(json_build_object('name', fb.name, 'amount', fb.amount))
            FROM fulltime_actual_bonus fb 
            WHERE fb.payslip_id = fp.payslip_id
        ), 
        '[]'::json
    )::text as bonuses_json,

    -- Gom nhóm Deductions thành JSON Text
    COALESCE(
        (
            SELECT JSON_AGG(json_build_object('name', fd.name, 'amount', fd.amount))
            FROM fulltime_payslip_deduction fd 
            WHERE fd.payslip_id = fp.payslip_id
        ), 
        '[]'::json
    )::text as deductions_json

FROM fulltime_payslip fp
JOIN employee_account e ON fp.employee_id = e.id;