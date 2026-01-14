CREATE DATABASE "HRM";
-- Make sure subsequent statements execute in the newly created HRM database
\connect "HRM"
-- Xóa các bảng cũ nếu tồn tại (để reset demo)
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

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
    sex gender_enum,
    phone VARCHAR(20),
    email VARCHAR(100) UNIQUE NOT NULL,
    bank_account_number VARCHAR(50),
    address TEXT,
    dob DATE,
    type emp_type_enum NOT NULL, -- Phân loại Fulltime/Freelance
    status emp_status_enum DEFAULT 'Active',
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
    type contract_type_enum NOT NULL -- Definite/Indefinite
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
(1, '2023-01-01', NULL, 25000000.00, 1.5, 15, 'Indefinite'),
(2, '2023-03-01', NULL, 22000000.00, 1.5, 12, 'Indefinite'),
(3, '2024-01-01', '2025-12-31', 30000000.00, 2.0, 12, 'Definite');

-- 4. Fulltime Contract Details (Allowances)
INSERT INTO fulltime_contract_allowance (contract_id, stt, name, amount) VALUES
(1, 1, 'Transportation Allowance', 1500000.00),
(1, 2, 'Meal Allowance', 1000000.00),
(2, 1, 'Transportation Allowance', 1500000.00),
(3, 1, 'Housing Allowance', 3000000.00),
(3, 2, 'Transportation Allowance', 2000000.00);

-- 5. Fulltime Contract Bonus
INSERT INTO fulltime_contract_bonus (contract_id, stt, name, amount, rate) VALUES
(1, 1, 'Performance Bonus', NULL, 10.00),
(2, 1, 'Quarterly Bonus', 2000000.00, NULL),
(3, 1, 'Annual Bonus', NULL, 15.00);

-- 6. Fulltime Contract Deduction
INSERT INTO fulltime_contract_deduction (contract_id, stt, name, amount, rate) VALUES
(1, 1, 'Social Insurance', NULL, 8.00),
(1, 2, 'Health Insurance', NULL, 1.50),
(1, 3, 'Unemployment Insurance', NULL, 1.00),
(2, 1, 'Social Insurance', NULL, 8.00),
(2, 2, 'Health Insurance', NULL, 1.50),
(3, 1, 'Social Insurance', NULL, 8.00);

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
(4, '2024-01-15', '2024-06-30', 50000000.00, '2024-06-15'),
(5, '2024-03-01', '2024-12-31', 80000000.00, '2024-11-30');

-- 9. Freelance Contract Bonus
INSERT INTO freelance_contract_bonus (contract_id, stt, name, amount, rate) VALUES
(1, 1, 'Early Completion Bonus', 5000000.00, NULL),
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
(1, 1, 1, 24500000.00, 27500000.00),
(1, 2, 2, 22000000.00, 25500000.00),
(1, 3, 3, 31500000.00, 35000000.00);

-- 16. Fulltime Actual Allowance
INSERT INTO fulltime_actual_allowance (payslip_id, stt, name, amount) VALUES
(1, 1, 'Transportation Allowance', 1500000.00),
(1, 2, 'Meal Allowance', 1000000.00),
(2, 1, 'Transportation Allowance', 1500000.00),
(3, 1, 'Housing Allowance', 3000000.00),
(3, 2, 'Transportation Allowance', 2000000.00);

-- 17. Fulltime Actual Bonus
INSERT INTO fulltime_actual_bonus (payslip_id, stt, name, amount) VALUES
(1, 1, 'Performance Bonus', 2500000.00),
(2, 1, 'Quarterly Bonus', 2000000.00),
(3, 1, 'Annual Bonus', 4500000.00);

-- 18. Fulltime Payslip Deduction
INSERT INTO fulltime_payslip_deduction (payslip_id, stt, name, amount) VALUES
(1, 1, 'Social Insurance', 2200000.00),
(1, 2, 'Health Insurance', 412500.00),
(1, 3, 'Unemployment Insurance', 275000.00),
(2, 1, 'Social Insurance', 2040000.00),
(2, 2, 'Health Insurance', 382500.00),
(3, 1, 'Social Insurance', 2800000.00);

-- 19. Freelance Payslip
INSERT INTO freelance_payslip (payroll_id, employee_id, contract_id, final_amount) VALUES
(1, 4, 1, 28000000.00),
(1, 5, 2, 45000000.00);

-- 20. Freelance Actual Bonus
INSERT INTO freelance_actual_bonus (payslip_id, stt, name, amount) VALUES
(1, 1, 'Early Completion Bonus', 5000000.00),
(2, 1, 'Quality Bonus', 8000000.00);

-- 21. Freelance Actual Penalty
INSERT INTO freelance_actual_penalty (payslip_id, stt, name, amount) VALUES
(1, 1, 'Late Delivery Penalty', 2000000.00);

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