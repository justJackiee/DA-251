-- CREATE DATABASE "HRM";
-- Make sure subsequent statements execute in the newly created HRM database
-- \connect "HRM"
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
    end_date DATE,
    base_salary DECIMAL(15, 2) NOT NULL,
    ot_rate DECIMAL(5, 2) DEFAULT 1.5,
    standard_work_days DECIMAL(5, 2) DEFAULT 22.0, -- THÊM MỚI: Ngày công chuẩn theo hợp đồng
    annual_leave_days INT DEFAULT 12,
    type text NOT NULL,
    document_path VARCHAR(500)
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
    committed_deadline DATE,
    document_path VARCHAR(500)
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
    gross_salary DECIMAL(15, 2),
    -- SNAPSHOT cho việc tính toán và hiển thị Payslip.
    snap_actual_work_days   DECIMAL(15, 2), -- Số công thực tế tháng đó
    snap_ot_hours           DECIMAL(15, 2), -- Số giờ OT
    snap_taxable_income     DECIMAL(15, 2) -- Thu nhập chịu thuế (để giải trình thuế)
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
(1, 1, 'Responsibility Allowance', 1500000.00),
(1, 2, 'Living Allowance', 1000000.00),
(2, 1, 'Responsibility Allowance', 1500000.00),
(3, 1, 'Travel Allowance', 3000000.00),
(3, 2, 'Responsibility Allowance', 2000000.00);

-- 5. Fulltime Contract Bonus
INSERT INTO fulltime_contract_bonus (contract_id, stt, name, amount, rate) VALUES
-- Hợp đồng 1: Có 3 loại thưởng -> stt chạy từ 1 đến 3
(1, 1, 'Performance Bonus', NULL, 10.00),
(1, 2, 'Quarter Bonus', 3000000.00, NULL),
(1, 3, 'Year Bonus', NULL, 30.00),

-- Hợp đồng 2: Có 2 loại thưởng -> stt chạy từ 1 đến 2
(2, 1, 'Quarter Bonus', 2000000.00, NULL),
(2, 2, 'Year Bonus', NULL, 25.00),

-- Hợp đồng 3: Có 2 loại thưởng -> stt chạy từ 1 đến 2
(3, 1, 'Quarter Bonus', 1500000.00, NULL),
(3, 2, 'Year Bonus', NULL, 15.00);

-- 6. Fulltime Contract Deduction
INSERT INTO fulltime_contract_deduction (contract_id, stt, name, amount, rate) VALUES
(1, 1, 'Social Insurance', NULL, 8.00),
(1, 2, 'Health Insurance', NULL, 1.50),
(1, 3, 'Unemployment Insurance', NULL, 1.00),
(2, 1, 'Social Insurance', NULL, 8.00),
(2, 2, 'Health Insurance', NULL, 1.50),
(2, 3, 'Unemployment Insurance', NULL, 1.00),
(3, 1, 'Social Insurance', NULL, 8.00),
(3, 2, 'Health Insurance', NULL, 1.50),
(3, 3, 'Unemployment Insurance', NULL, 1.00);

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
INSERT INTO freelance_contract (employee_id, start_date, end_date, value, committed_deadline, document_path) VALUES
(4, '2024-01-15', '2024-06-30', 50000000.00, '2024-06-15', 'contracts/freelance_4.pdf'),
(5, '2024-03-01', '2024-12-31', 80000000.00, '2024-11-30', 'contracts/freelance_5.pdf');

-- 9. Freelance Contract Bonus
INSERT INTO freelance_contract_bonus (contract_id, stt, name, amount, rate) VALUES
(1, 1, 'Early Completion Bonus', 5000000.00, NULL),
(2, 1, 'Quality Bonus', NULL, 10.00);

-- 10. Freelance Contract Penalty
INSERT INTO freelance_contract_penalty (contract_id, stt, name, amount, rate) VALUES
(1, 1, 'Late Delivery Penalty', NULL, 5.00),
(2, 1, 'Quality Issue Penalty', 3000000.00, NULL);

-- 11. Timesheet
INSERT INTO timesheet (date, checkin_time, checkout_time, employee_id) VALUES
-- November 3: John (emp 1) FULL DAY - 2 sessions: 8h total
('2025-11-03','2025-11-03 07:55','2025-11-03 12:05',1),
('2025-11-03','2025-11-03 13:00','2025-11-03 17:10',1),

-- November 4: John LATE - chỉ 7h (5h <= T < 7.75h)
('2025-11-04','2025-11-04 08:30','2025-11-04 16:30',1),

-- November 5: John FULL DAY - 8h đủ
('2025-11-05','2025-11-05 07:50','2025-11-05 17:00',1),

-- November 6: John HALF_DAY - 4h (3.75h <= T < 5h)
('2025-11-06','2025-11-06 08:00','2025-11-06 13:00',1),

-- November 7: John ABSENT - chỉ 2h (T < 3.75h)
('2025-11-07','2025-11-07 08:00','2025-11-07 10:30',1),

-- November 3-7: Các nhân viên khác
('2025-11-03','2025-11-03 08:10','2025-11-03 18:05',2),
('2025-11-03','2025-11-03 08:05','2025-11-03 17:40',3),

('2025-11-04','2025-11-04 08:12','2025-11-04 18:00',2),
('2025-11-04','2025-11-04 07:58','2025-11-04 17:10',3),

-- November 5: Employee 2 nghỉ phép (APPROVED leave)
('2025-11-05','2025-11-05 08:00','2025-11-05 17:00',3),

('2025-11-06','2025-11-06 08:05','2025-11-06 18:20',2),
('2025-11-06','2025-11-06 07:55','2025-11-06 17:45',3),

('2025-11-07','2025-11-07 08:00','2025-11-07 18:00',2),
('2025-11-07','2025-11-07 08:08','2025-11-07 17:55',3),

-- Week 2: More test cases
-- November 10-11: Employee 2 nghỉ phép (APPROVED leave)
-- November 10: John FULL with OT - 8h shift + 1h OT (17:00-18:00)
('2025-11-10','2025-11-10 08:00','2025-11-10 12:00',1),
('2025-11-10','2025-11-10 13:00','2025-11-10 18:00',1),

-- November 11: John LATE (boundary test) - đúng 5h (5h <= T < 7.75h)
('2025-11-11','2025-11-11 08:00','2025-11-11 12:00',1),
('2025-11-11','2025-11-11 13:00','2025-11-11 14:00',1),

-- November 12: John FULL (boundary test) - đúng 7.75h
('2025-11-12','2025-11-12 08:00','2025-11-12 16:45',1),

-- November 13: John HALF_DAY (boundary test) - đúng 3.75h
('2025-11-13','2025-11-13 08:00','2025-11-13 12:45',1),

-- November 14: John ABSENT (boundary test) - 3.5h < 3.75h
('2025-11-14','2025-11-14 08:00','2025-11-14 12:30',1),

-- Các nhân viên khác tuần 2 (emp 2 nghỉ phép 10-11/11)
('2025-11-12','2025-11-12 08:10','2025-11-12 17:45',2),
('2025-11-13','2025-11-13 08:00','2025-11-13 17:00',2),
('2025-11-14','2025-11-14 08:05','2025-11-14 17:20',2);


--Week 2
INSERT INTO timesheet (date, checkin_time, checkout_time, employee_id) VALUES
--('2025-11-10','2025-11-10 07:57','2025-11-10 17:05',1),
('2025-11-10','2025-11-10 08:10','2025-11-10 18:10',2),
('2025-11-10','2025-11-10 07:52','2025-11-10 17:42',3),

('2025-11-11','2025-11-11 08:03','2025-11-11 17:00',1),
('2025-11-11','2025-11-11 08:12','2025-11-11 18:25',2),
('2025-11-11','2025-11-11 08:05','2025-11-11 17:50',3),

--('2025-11-12','2025-11-12 07:55','2025-11-12 17:18',1),
('2025-11-12','2025-11-12 08:08','2025-11-12 18:00',2),
('2025-11-12','2025-11-12 08:00','2025-11-12 17:30',3),

--('2025-11-13','2025-11-13 07:50','2025-11-13 17:10',1),
('2025-11-13','2025-11-13 08:10','2025-11-13 18:20',2),
('2025-11-13','2025-11-13 07:58','2025-11-13 17:00',3),

--('2025-11-14','2025-11-14 08:05','2025-11-14 17:00',1),
('2025-11-14','2025-11-14 08:15','2025-11-14 18:12',2),
('2025-11-14','2025-11-14 08:10','2025-11-14 17:38',3);

--Week 3 
INSERT INTO timesheet (date, checkin_time, checkout_time, employee_id) VALUES
('2025-11-17','2025-11-17 07:55','2025-11-17 17:30',1),
('2025-11-17','2025-11-17 08:12','2025-11-17 18:00',2),
('2025-11-17','2025-11-17 08:00','2025-11-17 17:45',3),

('2025-11-18','2025-11-18 07:57','2025-11-18 17:00',1),
('2025-11-18','2025-11-18 08:05','2025-11-18 18:15',2),
('2025-11-18','2025-11-18 08:10','2025-11-18 17:33',3),

('2025-11-19','2025-11-19 08:05','2025-11-19 17:10',1),
('2025-11-19','2025-11-19 08:14','2025-11-19 18:08',2),
('2025-11-19','2025-11-19 07:55','2025-11-19 17:58',3),

('2025-11-20','2025-11-20 07:50','2025-11-20 17:00',1),
('2025-11-20','2025-11-20 08:10','2025-11-20 18:00',2),
('2025-11-20','2025-11-20 08:05','2025-11-20 17:45',3),

('2025-11-21','2025-11-21 08:02','2025-11-21 17:22',1),
('2025-11-21','2025-11-21 08:12','2025-11-21 18:05',2),
('2025-11-21','2025-11-21 07:57','2025-11-21 17:37',3);

--Week 4
INSERT INTO timesheet (date, checkin_time, checkout_time, employee_id) VALUES
('2025-11-24','2025-11-24 07:55','2025-11-24 17:10',1),
('2025-11-24','2025-11-24 08:00','2025-11-24 18:20',2),
('2025-11-24','2025-11-24 07:50','2025-11-24 17:30',3),

('2025-11-25','2025-11-25 08:00','2025-11-25 17:00',1),
('2025-11-25','2025-11-25 07:59','2025-11-25 18:08',2),
('2025-11-25','2025-11-25 07:55','2025-11-25 17:48',3),

('2025-11-26','2025-11-26 07:58','2025-11-26 17:15',1),
('2025-11-26','2025-11-26 08:00','2025-11-26 18:00',2),
('2025-11-26','2025-11-26 08:05','2025-11-26 17:41',3),

('2025-11-27','2025-11-27 08:03','2025-11-27 17:00',1),
('2025-11-27','2025-11-27 7:50','2025-11-27 18:10',2),
('2025-11-27','2025-11-27 07:58','2025-11-27 17:55',3),

('2025-11-28','2025-11-28 07:50','2025-11-28 17:23',1),
('2025-11-28','2025-11-28 07:45','2025-11-28 18:00',2),
('2025-11-28','2025-11-28 08:00','2025-11-28 17:40',3);

-- ============================
-- TIMESHEET: DECEMBER 2025 (01 → 05)
-- ============================

INSERT INTO timesheet (date, checkin_time, checkout_time, employee_id) VALUES
('2025-12-01','2025-12-01 07:55','2025-12-01 17:12',1),
('2025-12-01','2025-12-01 07:55','2025-12-01 18:10',2),
('2025-12-01','2025-12-01 08:05','2025-12-01 17:40',3),

('2025-12-02','2025-12-02 07:58','2025-12-02 17:00',1),
('2025-12-02','2025-12-02 08:00','2025-12-02 18:20',2),
('2025-12-02','2025-12-02 07:52','2025-12-02 17:55',3),

('2025-12-03','2025-12-03 08:00','2025-12-03 17:18',1),
('2025-12-03','2025-12-03 08:12','2025-12-03 18:00',2),
('2025-12-03','2025-12-03 07:55','2025-12-03 17:33',3),

('2025-12-04','2025-12-04 07:50','2025-12-04 17:00',1),
('2025-12-04','2025-12-04 08:00','2025-12-04 18:12',2),
('2025-12-04','2025-12-04 08:05','2025-12-04 17:48',3),

('2025-12-05','2025-12-05 07:57','2025-12-05 17:25',1),
('2025-12-05','2025-12-05 08:05','2025-12-05 18:00',2),
('2025-12-05','2025-12-05 07:54','2025-12-05 17:50',3);



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
(1, 1, 'Responsibility Allowance', 1500000.00),
(1, 2, 'Living Allowance', 1000000.00),
(2, 1, 'Responsibility Allowance', 1500000.00),
(3, 1, 'Travel Allowance', 3000000.00),
(3, 2, 'Responsibility Allowance', 2000000.00);

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
-- JANUARY 2026 SAMPLE DATA
-- ============================================

-- ============================
-- 1. TIMESHEET: JANUARY 2026 (All working days)
-- ============================

-- Week 1 (Jan 5-9, 2026 - Mon to Fri)
INSERT INTO timesheet (date, checkin_time, checkout_time, employee_id) VALUES
('2026-01-05','2026-01-05 07:55','2026-01-05 17:10',1),
('2026-01-05','2026-01-05 08:00','2026-01-05 18:15',2),
('2026-01-05','2026-01-05 08:05','2026-01-05 17:40',3),

('2026-01-06','2026-01-06 07:58','2026-01-06 17:20',1),
('2026-01-06','2026-01-06 08:10','2026-01-06 18:00',2),
('2026-01-06','2026-01-06 07:55','2026-01-06 17:35',3),

('2026-01-07','2026-01-07 08:00','2026-01-07 17:15',1),
('2026-01-07','2026-01-07 08:05','2026-01-07 18:20',2),
('2026-01-07','2026-01-07 08:00','2026-01-07 17:45',3),

('2026-01-08','2026-01-08 07:52','2026-01-08 17:00',1),
('2026-01-08','2026-01-08 08:00','2026-01-08 18:10',2),
('2026-01-08','2026-01-08 07:58','2026-01-08 17:50',3),

('2026-01-09','2026-01-09 08:05','2026-01-09 17:25',1),
('2026-01-09','2026-01-09 08:12','2026-01-09 18:00',2),
('2026-01-09','2026-01-09 08:02','2026-01-09 17:30',3);

-- Week 2 (Jan 12-16, 2026)
INSERT INTO timesheet (date, checkin_time, checkout_time, employee_id) VALUES
('2026-01-12','2026-01-12 07:50','2026-01-12 17:00',1),
('2026-01-12','2026-01-12 08:00','2026-01-12 18:05',2),
('2026-01-12','2026-01-12 07:55','2026-01-12 17:40',3),

('2026-01-13','2026-01-13 08:00','2026-01-13 17:18',1),
('2026-01-13','2026-01-13 08:08','2026-01-13 18:15',2),
('2026-01-13','2026-01-13 08:00','2026-01-13 17:35',3),

('2026-01-14','2026-01-14 07:55','2026-01-14 17:10',1),
('2026-01-14','2026-01-14 08:05','2026-01-14 18:00',2),
('2026-01-14','2026-01-14 07:58','2026-01-14 17:45',3),

('2026-01-15','2026-01-15 08:02','2026-01-15 17:22',1),
('2026-01-15','2026-01-15 08:10','2026-01-15 18:20',2),
('2026-01-15','2026-01-15 08:05','2026-01-15 17:50',3),

('2026-01-16','2026-01-16 07:58','2026-01-16 17:15',1),
('2026-01-16','2026-01-16 08:00','2026-01-16 18:10',2),
('2026-01-16','2026-01-16 08:00','2026-01-16 17:30',3);

-- Week 3 (Jan 19-23, 2026)
INSERT INTO timesheet (date, checkin_time, checkout_time, employee_id) VALUES
('2026-01-19','2026-01-19 07:55','2026-01-19 17:20',1),
('2026-01-19','2026-01-19 08:05','2026-01-19 18:00',2),
('2026-01-19','2026-01-19 07:58','2026-01-19 17:35',3),

('2026-01-20','2026-01-20 08:00','2026-01-20 17:10',1),
('2026-01-20','2026-01-20 08:10','2026-01-20 18:15',2),
('2026-01-20','2026-01-20 08:02','2026-01-20 17:45',3),

('2026-01-21','2026-01-21 07:52','2026-01-21 17:00',1),
('2026-01-21','2026-01-21 08:00','2026-01-21 18:20',2),
('2026-01-21','2026-01-21 07:55','2026-01-21 17:40',3),

('2026-01-22','2026-01-22 08:05','2026-01-22 17:25',1),
('2026-01-22','2026-01-22 08:08','2026-01-22 18:00',2),
('2026-01-22','2026-01-22 08:00','2026-01-22 17:50',3),

('2026-01-23','2026-01-23 07:58','2026-01-23 17:15',1),
('2026-01-23','2026-01-23 08:05','2026-01-23 18:10',2),
('2026-01-23','2026-01-23 07:58','2026-01-23 17:35',3);

-- Week 4 (Jan 26-30, 2026)
INSERT INTO timesheet (date, checkin_time, checkout_time, employee_id) VALUES
('2026-01-26','2026-01-26 07:55','2026-01-26 17:10',1),
('2026-01-26','2026-01-26 08:00','2026-01-26 18:05',2),
('2026-01-26','2026-01-26 08:02','2026-01-26 17:40',3),

('2026-01-27','2026-01-27 08:00','2026-01-27 17:20',1),
('2026-01-27','2026-01-27 08:10','2026-01-27 18:15',2),
('2026-01-27','2026-01-27 07:55','2026-01-27 17:45',3),

('2026-01-28','2026-01-28 07:52','2026-01-28 17:00',1),
('2026-01-28','2026-01-28 08:05','2026-01-28 18:20',2),
('2026-01-28','2026-01-28 08:00','2026-01-28 17:35',3),

('2026-01-29','2026-01-29 08:05','2026-01-29 17:25',1),
('2026-01-29','2026-01-29 08:00','2026-01-29 18:00',2),
('2026-01-29','2026-01-29 07:58','2026-01-29 17:50',3),

('2026-01-30','2026-01-30 07:58','2026-01-30 17:18',1),
('2026-01-30','2026-01-30 08:08','2026-01-30 18:10',2),
('2026-01-30','2026-01-30 08:02','2026-01-30 17:30',3);

-- ============================
-- 2. UPDATE FREELANCE CONTRACTS to end in January 2026
-- ============================
UPDATE freelance_contract SET end_date = '2026-01-31' WHERE employee_id = 4;
UPDATE freelance_contract SET end_date = '2026-01-31' WHERE employee_id = 5;

-- ============================
-- 3. PAYROLL PERIOD: January 2026
-- ============================
INSERT INTO payroll (period_start, period_end, month, year, status, hr_approve, is_approved) VALUES
('2026-01-01', '2026-01-31', 1, 2026, 'Unpaid', 1, TRUE);

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

-- Test payroll details for John Smith
INSERT INTO payroll (period_start, period_end, month, year, status, is_approved) VALUES 
('2024-10-01', '2024-10-31', 10, 2024, 'Paid', TRUE),
('2024-09-01', '2024-09-30', 9, 2024, 'Paid', TRUE),
('2024-08-01', '2024-08-31', 8, 2024, 'Paid', TRUE),
('2024-07-01', '2024-07-31', 7, 2024, 'Paid', TRUE),
('2024-06-01', '2024-06-30', 6, 2024, 'Paid', TRUE);

INSERT INTO fulltime_payslip (payroll_id, employee_id, contract_id, net_salary, gross_salary) VALUES 
((SELECT id FROM payroll WHERE month=10), 1, 1, 24000000, 27000000),
((SELECT id FROM payroll WHERE month=9), 1, 1, 23500000, 27000000),
((SELECT id FROM payroll WHERE month=8), 1, 1, 24500000, 27000000),
((SELECT id FROM payroll WHERE month=7), 1, 1, 24000000, 27000000),
((SELECT id FROM payroll WHERE month=6), 1, 1, 22000000, 25000000);

CREATE OR REPLACE PROCEDURE sp_generate_fulltime_payslip(
    p_payroll_id BIGINT,
    p_employee_id BIGINT,
    p_actual_work_days DECIMAL(15, 2),
    p_ot_hours DECIMAL(15, 2),
    p_manual_bonus JSONB DEFAULT '{}'::JSONB,
    p_manual_penalty JSONB DEFAULT '{}'::JSONB 
)
LANGUAGE plpgsql
AS $$
DECLARE
    -- Constants
    HOURS_STANDARD_DAY CONSTANT INT := 8;
    SELF_DEDUCTION CONSTANT DECIMAL(15, 2) := 15500000.00; 
    DEPENDENT_UNIT_AMOUNT CONSTANT DECIMAL(15, 2) := 6200000.00; 

    v_payroll_status payroll_status_enum;
    v_month INT; v_year INT;
    
    v_contract_id INT;
    v_base_salary DECIMAL(15, 2);
    v_payslip_id INT;
    v_hours_standard_month DECIMAL(15, 2);
    v_standard_work_days DECIMAL(5, 2);
    
    -- Allowances & Bonuses
    v_responsibility_allowance DECIMAL(15, 2) := 0; 
    v_living_allowance DECIMAL(15, 2) := 0; 
    v_travel_allowance DECIMAL(15, 2) := 0;
    v_holiday_bonus DECIMAL(15, 2) := 0;
    v_other_bonus DECIMAL(15, 2) := 0;
    v_performance_bonus DECIMAL(15, 2) := 0;
    v_quarter_bonus DECIMAL(15, 2) := 0;
    v_year_bonus DECIMAL(15, 2) := 0;
    v_total_bonus DECIMAL(15, 2) := 0;
    
    -- Penalty & STT
    v_total_penalty DECIMAL(15, 2) := 0;
    r_penalty RECORD;
    v_stt_counter INT := 1;
    
    -- Calculation vars
    v_ot_rate DECIMAL(15, 2) := 0;
    v_ot_amount DECIMAL(15, 2) := 0;
    v_contract_gross DECIMAL(15, 2);
    v_actual_gross_income DECIMAL(15, 2);
    
    -- Deductions
    v_bhxh DECIMAL(15, 2); v_bhyt DECIMAL(15, 2); v_bhtn DECIMAL(15, 2);
    v_dependent_count INT := 0;
    v_total_dep_deduction DECIMAL(15, 2) := 0;
    v_total_statutory_deduction DECIMAL(15, 2);
    
    v_taxable_income DECIMAL(15, 2) := 0; 
    v_saved_taxable_income DECIMAL(15, 2) := 0; 
    v_tax DECIMAL(15, 2) := 0; 
    v_net_income DECIMAL(15, 2); 

    r_bonus RECORD;
    v_calc_amount DECIMAL(15, 2) := 0;

BEGIN
    -- 1. CHECK STATUS
    SELECT status, month, year INTO v_payroll_status, v_month, v_year 
    FROM payroll WHERE id = p_payroll_id;

    IF v_payroll_status = 'Paid' THEN
        RAISE EXCEPTION 'PAYROLL_LOCKED: Kỳ lương này đã khóa.';
    END IF;

    IF p_actual_work_days < 0 THEN RAISE EXCEPTION 'Actual work days cannot be negative.'; END IF;

    -- 2. GET CONTRACT
    SELECT contract_id, base_salary, ot_rate, standard_work_days
    INTO v_contract_id, v_base_salary, v_ot_rate, v_standard_work_days
    FROM fulltime_contract
    WHERE employee_id = p_employee_id
    ORDER BY start_date DESC LIMIT 1;

    IF v_contract_id IS NULL THEN RETURN; END IF;

    IF v_standard_work_days IS NULL OR v_standard_work_days = 0 THEN 
        v_standard_work_days := 22.0; 
    END IF;

    v_hours_standard_month := v_standard_work_days * HOURS_STANDARD_DAY;

    -- 3. ALLOWANCES
    SELECT COALESCE(SUM(CASE WHEN name = 'Responsibility Allowance' THEN amount ELSE 0 END), 0),
           COALESCE(SUM(CASE WHEN name = 'Living Allowance' THEN amount ELSE 0 END), 0),
           COALESCE(SUM(CASE WHEN name = 'Travel Allowance' THEN amount ELSE 0 END), 0)
    INTO v_responsibility_allowance, v_living_allowance, v_travel_allowance
    FROM fulltime_contract_allowance WHERE contract_id = v_contract_id;

    -- 4. BONUS PROCESS
    v_holiday_bonus := COALESCE((p_manual_bonus->>'holiday')::DECIMAL, 0);
    v_other_bonus   := COALESCE((p_manual_bonus->>'other')::DECIMAL, 0);

    FOR r_bonus IN SELECT name, amount, rate FROM fulltime_contract_bonus WHERE contract_id = v_contract_id LOOP
        v_calc_amount := COALESCE(r_bonus.amount, v_base_salary * (r_bonus.rate / 100.0));
        IF r_bonus.name ILIKE '%Performance%' THEN v_performance_bonus := v_performance_bonus + v_calc_amount;
        ELSIF r_bonus.name ILIKE '%Quarter%' AND v_month IN (3, 6, 9, 12) THEN v_quarter_bonus := v_quarter_bonus + v_calc_amount;
        ELSIF r_bonus.name ILIKE '%Year%' AND v_month = 12 THEN v_year_bonus := v_year_bonus + v_calc_amount;
        END IF;
    END LOOP;

    v_total_bonus := v_holiday_bonus + v_other_bonus + v_performance_bonus + v_quarter_bonus + v_year_bonus;

    -- 5. OT & GROSS
    IF p_ot_hours > 0 AND v_ot_rate IS NOT NULL THEN
        v_ot_amount := (v_base_salary / v_hours_standard_month) * p_ot_hours * v_ot_rate;
    END IF;

    v_contract_gross := v_base_salary + v_responsibility_allowance + v_living_allowance;
    
    -- Tính Gross thực tế (Đã bao gồm ngày công thực tế, OT, Bonus...)
    v_actual_gross_income := (v_contract_gross + v_total_bonus + v_ot_amount + v_travel_allowance) / v_standard_work_days * p_actual_work_days;
                             
    -- 6. DEDUCTIONS (BẢO HIỂM)
    -- [UPDATED LOGIC] Dùng v_actual_gross_income để tính % bảo hiểm thay vì v_base_salary
    SELECT 
        COALESCE(SUM(CASE WHEN name = 'Social Insurance' THEN (v_actual_gross_income * rate / 100.0) ELSE 0 END), 0),
        COALESCE(SUM(CASE WHEN name = 'Health Insurance' THEN (v_actual_gross_income * rate / 100.0) ELSE 0 END), 0),
        COALESCE(SUM(CASE WHEN name = 'Unemployment Insurance' THEN (v_actual_gross_income * rate / 100.0) ELSE 0 END), 0),
        COALESCE(SUM(CASE WHEN name = 'Dependent Deduction' THEN amount ELSE 0 END), 0)
    INTO v_bhxh, v_bhyt, v_bhtn, v_dependent_count
    FROM fulltime_contract_deduction WHERE contract_id = v_contract_id;

    v_total_statutory_deduction := v_bhxh + v_bhyt + v_bhtn;
    v_total_dep_deduction := v_dependent_count * DEPENDENT_UNIT_AMOUNT;

    -- 7. PIT (5 BẬC)
    v_taxable_income := GREATEST(0, v_actual_gross_income - v_total_statutory_deduction - SELF_DEDUCTION - v_total_dep_deduction);
    v_saved_taxable_income := v_taxable_income;

    IF v_taxable_income > 0 THEN
        IF v_taxable_income > 100000000 THEN v_tax := v_tax + (v_taxable_income - 100000000) * 0.35; v_taxable_income := 100000000; END IF;
        IF v_taxable_income > 60000000 THEN v_tax := v_tax + (v_taxable_income - 60000000) * 0.30; v_taxable_income := 60000000; END IF;
        IF v_taxable_income > 30000000 THEN v_tax := v_tax + (v_taxable_income - 30000000) * 0.20; v_taxable_income := 30000000; END IF;
        IF v_taxable_income > 10000000 THEN v_tax := v_tax + (v_taxable_income - 10000000) * 0.10; v_taxable_income := 10000000; END IF;
        v_tax := v_tax + v_taxable_income * 0.05;
    END IF;

    -- 8. PENALTY
    SELECT SUM(value::DECIMAL) INTO v_total_penalty FROM jsonb_each_text(p_manual_penalty);
    v_total_penalty := COALESCE(v_total_penalty, 0);

    -- 9. NET INCOME
    v_net_income := GREATEST(0, v_actual_gross_income - v_total_statutory_deduction - v_tax - v_total_penalty);

    -- 10. PERSIST
    -- Clean up child tables first
    DELETE FROM fulltime_actual_allowance WHERE payslip_id IN (SELECT payslip_id FROM fulltime_payslip WHERE payroll_id = p_payroll_id AND employee_id = p_employee_id);
    DELETE FROM fulltime_actual_bonus WHERE payslip_id IN (SELECT payslip_id FROM fulltime_payslip WHERE payroll_id = p_payroll_id AND employee_id = p_employee_id);
    DELETE FROM fulltime_payslip_deduction WHERE payslip_id IN (SELECT payslip_id FROM fulltime_payslip WHERE payroll_id = p_payroll_id AND employee_id = p_employee_id);
    
    DELETE FROM fulltime_payslip WHERE payroll_id = p_payroll_id AND employee_id = p_employee_id;

    INSERT INTO fulltime_payslip (
        payroll_id, employee_id, contract_id, gross_salary, net_salary,
        snap_actual_work_days, snap_ot_hours, snap_taxable_income
    )
    VALUES (
        p_payroll_id, p_employee_id, v_contract_id, v_actual_gross_income, v_net_income,
        p_actual_work_days, p_ot_hours, v_saved_taxable_income
    )
    RETURNING payslip_id INTO v_payslip_id;

    -- Insert Allowances
    INSERT INTO fulltime_actual_allowance (payslip_id, stt, name, amount)
    SELECT v_payslip_id, stt, name, amount
    FROM fulltime_contract_allowance
    WHERE contract_id = v_contract_id;

    -- Insert Bonuses (only those that apply based on calculation logic)
    v_stt_counter := 1;
    FOR r_bonus IN SELECT name, amount, rate FROM fulltime_contract_bonus WHERE contract_id = v_contract_id LOOP
        v_calc_amount := COALESCE(r_bonus.amount, v_base_salary * (r_bonus.rate / 100.0));
        IF r_bonus.name ILIKE '%Performance%' THEN
            INSERT INTO fulltime_actual_bonus (payslip_id, stt, name, amount) VALUES (v_payslip_id, v_stt_counter, r_bonus.name, v_calc_amount);
            v_stt_counter := v_stt_counter + 1;
        ELSIF r_bonus.name ILIKE '%Quarter%' AND v_month IN (3, 6, 9, 12) THEN
            INSERT INTO fulltime_actual_bonus (payslip_id, stt, name, amount) VALUES (v_payslip_id, v_stt_counter, r_bonus.name, v_calc_amount);
            v_stt_counter := v_stt_counter + 1;
        ELSIF r_bonus.name ILIKE '%Year%' AND v_month = 12 THEN
            INSERT INTO fulltime_actual_bonus (payslip_id, stt, name, amount) VALUES (v_payslip_id, v_stt_counter, r_bonus.name, v_calc_amount);
            v_stt_counter := v_stt_counter + 1;
        END IF;
    END LOOP;

    -- Insert manual bonuses (holiday, other)
    IF v_holiday_bonus > 0 THEN
        INSERT INTO fulltime_actual_bonus (payslip_id, stt, name, amount) VALUES (v_payslip_id, v_stt_counter, 'Holiday Bonus', v_holiday_bonus);
        v_stt_counter := v_stt_counter + 1;
    END IF;
    IF v_other_bonus > 0 THEN
        INSERT INTO fulltime_actual_bonus (payslip_id, stt, name, amount) VALUES (v_payslip_id, v_stt_counter, 'Other Bonus', v_other_bonus);
        v_stt_counter := v_stt_counter + 1;
    END IF;

    INSERT INTO fulltime_payslip_deduction (payslip_id, stt, name, amount) VALUES
    (v_payslip_id, 1, 'Self Deduction', SELF_DEDUCTION),
    (v_payslip_id, 2, 'Dependent Deduction (' || v_dependent_count || ')', v_total_dep_deduction),
    (v_payslip_id, 3, 'Social Insurance', v_bhxh),
    (v_payslip_id, 4, 'Health Insurance', v_bhyt),
    (v_payslip_id, 5, 'Unemployment Insurance', v_bhtn),
    (v_payslip_id, 6, 'Personal Income Tax', v_tax);
    
    v_stt_counter := 7;
    FOR r_penalty IN SELECT key, value FROM jsonb_each_text(p_manual_penalty) LOOP
        INSERT INTO fulltime_payslip_deduction (payslip_id, stt, name, amount)
        VALUES (v_payslip_id, v_stt_counter, 'Penalty: ' || r_penalty.key, r_penalty.value::DECIMAL);
        v_stt_counter := v_stt_counter + 1;
    END LOOP;

    RAISE NOTICE 'SUCCESS: Payslip % generated.', v_payslip_id;
END;
$$;

CREATE OR REPLACE VIEW view_fulltime_payslip_detail AS
SELECT 
    fp.payslip_id,
    fp.payroll_id,
    fp.employee_id,
    e.f_name || ' ' || e.l_name as full_name,
    e.bank_account_number,
    
    -- Các con số tài chính tổng quan
    fp.gross_salary,
    fp.net_salary,
    fp.snap_taxable_income as taxable_income, -- Hiển thị thu nhập chịu thuế để giải trình
    
    -- Các biến số input đầu vào (Dùng để hiển thị công thức)
    fp.snap_actual_work_days as actual_work_days, -- Tử số (Biến động)
    fc.standard_work_days as formula_standard_days, -- Mẫu số (Cố định theo HĐ)
    fp.snap_ot_hours as ot_hours,                 -- Số giờ OT
    fc.ot_rate as formula_ot_rate,                -- Hệ số OT
    fc.base_salary,                               -- Lương cơ bản
    COALESCE(
        (
            SELECT JSON_AGG(json_build_object(
                'name', fa.name, 
                'actual_amount', fa.amount
            ))
            FROM fulltime_actual_allowance fa 
            WHERE fa.payslip_id = fp.payslip_id
        ), 
        '[]'::json
    )::text as allowances_json,

    -- 2. Chi tiết Thưởng (Gồm % rate nếu có để hiển thị: Base * Rate = Amount)
    COALESCE(
        (
            SELECT JSON_AGG(json_build_object(
                'name', fb.name, 
                'actual_amount', fb.amount,
                'contract_rate', cb.rate -- Hệ số % thưởng trong hợp đồng
            ))
            FROM fulltime_actual_bonus fb
            LEFT JOIN fulltime_contract_bonus cb ON cb.contract_id = fp.contract_id AND cb.name = fb.name
            WHERE fb.payslip_id = fp.payslip_id
        ), 
        '[]'::json
    )::text as bonuses_json,

    -- 3. Chi tiết Khấu trừ & Thuế (Quan trọng: Lấy được 8%, 1.5%, 1%...)
    COALESCE(
        (
            SELECT JSON_AGG(json_build_object(
                'name', fd.name, 
                'actual_amount', fd.amount,
                'contract_rate', cd.rate -- Hệ số % bảo hiểm/khấu trừ trong hợp đồng
            ))
            FROM fulltime_payslip_deduction fd
            LEFT JOIN fulltime_contract_deduction cd ON cd.contract_id = fp.contract_id AND cd.name = fd.name
            WHERE fd.payslip_id = fp.payslip_id
        ), 
        '[]'::json
    )::text as deductions_json
FROM fulltime_payslip fp
JOIN employee_account e ON fp.employee_id = e.id
JOIN fulltime_contract fc ON fp.contract_id = fc.contract_id;


CREATE OR REPLACE PROCEDURE sp_generate_freelance_payslip(
    p_payroll_id BIGINT,
    p_employee_id BIGINT,
    p_adjustments JSONB DEFAULT '{"bonuses": [], "penalties": []}'::JSONB
)
LANGUAGE plpgsql
AS $$
DECLARE
    -- Payroll info
    v_payroll_status payroll_status_enum;
    v_payroll_month INT;
    v_payroll_year INT;

    -- Contract info
    v_contract_id INT;
    v_contract_full_value DECIMAL(15, 2);
    v_contract_end_date DATE;
    
    -- Calculation vars
    v_contract_payment DECIMAL(15, 2) := 0; -- Số tiền hợp đồng thực trả kỳ này
    v_payslip_id INT;
    
    v_total_bonus DECIMAL(15, 2) := 0;
    v_total_penalty DECIMAL(15, 2) := 0;
    v_final_amount DECIMAL(15, 2);
    
    -- Temp vars
    r_bonus RECORD;
    r_penalty RECORD;
    v_item_amount DECIMAL(15, 2);
    v_stt INT := 1;
BEGIN
    -- 1. Check Status Payroll & Get Period Info
    SELECT status, month, year 
    INTO v_payroll_status, v_payroll_month, v_payroll_year
    FROM payroll 
    WHERE id = p_payroll_id;

    IF v_payroll_status = 'Paid' THEN
        RAISE EXCEPTION 'PAYROLL_LOCKED: Kỳ lương đã thanh toán.';
    END IF;

    IF v_payroll_status IS NULL THEN
        RAISE EXCEPTION 'PAYROLL_NOT_FOUND: Không tìm thấy kỳ lương ID %', p_payroll_id;
    END IF;

    -- 2. Get Active Contract Info
    -- Lấy hợp đồng active dựa trên end_date chưa qua hoặc mới nhất
    SELECT contract_id, value, end_date
    INTO v_contract_id, v_contract_full_value, v_contract_end_date
    FROM freelance_contract
    WHERE employee_id = p_employee_id
    ORDER BY start_date DESC LIMIT 1;

    IF v_contract_id IS NULL THEN
        RAISE NOTICE 'No active freelance contract for Emp ID %', p_employee_id;
        RETURN;
    END IF;

    -- =================================================================================
    -- [LOGIC MỚI] 3. Kiểm tra xem kỳ lương này có phải tháng kết thúc hợp đồng không?
    -- =================================================================================
    IF (EXTRACT(MONTH FROM v_contract_end_date) = v_payroll_month AND 
        EXTRACT(YEAR FROM v_contract_end_date) = v_payroll_year) THEN
        
        v_contract_payment := v_contract_full_value;
        RAISE NOTICE 'CONTRACT MATURITY: Kỳ lương trùng tháng kết thúc hợp đồng. Thanh toán full: %', v_contract_payment;
    ELSE
        v_contract_payment := 0;
        RAISE NOTICE 'INTERIM PERIOD: Chưa đến tháng kết thúc hợp đồng (%-%). Chỉ tính Bonus/Penalty nếu có.', EXTRACT(MONTH FROM v_contract_end_date), EXTRACT(YEAR FROM v_contract_end_date);
    END IF;

    -- 4. Calculate Bonuses (Vẫn tính nếu có yêu cầu, bất kể tháng nào)
    FOR r_bonus IN SELECT name, amount, rate FROM freelance_contract_bonus WHERE contract_id = v_contract_id LOOP
        IF (p_adjustments->'bonuses') ? r_bonus.name THEN
            v_item_amount := COALESCE(r_bonus.amount, v_contract_full_value * (r_bonus.rate / 100.0));
            v_total_bonus := v_total_bonus + v_item_amount;
        END IF;
    END LOOP;

    -- 5. Calculate Penalties
    FOR r_penalty IN SELECT name, amount, rate FROM freelance_contract_penalty WHERE contract_id = v_contract_id LOOP
        IF (p_adjustments->'penalties') ? r_penalty.name THEN
            v_item_amount := COALESCE(r_penalty.amount, v_contract_full_value * (r_penalty.rate / 100.0));
            v_total_penalty := v_total_penalty + v_item_amount;
        END IF;
    END LOOP;

    -- 6. Final Calculation
    -- Final = (0 hoặc Full Value) + Bonus - Penalty
    v_final_amount := v_contract_payment + v_total_bonus - v_total_penalty;

    -- 7. Cleanup Old Data (Re-calculate support)
    DELETE FROM freelance_actual_bonus WHERE payslip_id IN (SELECT payslip_id FROM freelance_payslip WHERE payroll_id = p_payroll_id AND employee_id = p_employee_id);
    DELETE FROM freelance_actual_penalty WHERE payslip_id IN (SELECT payslip_id FROM freelance_payslip WHERE payroll_id = p_payroll_id AND employee_id = p_employee_id);
    DELETE FROM freelance_payslip WHERE payroll_id = p_payroll_id AND employee_id = p_employee_id;

    -- 8. Insert Header
    INSERT INTO freelance_payslip (payroll_id, employee_id, contract_id, final_amount)
    VALUES (p_payroll_id, p_employee_id, v_contract_id, v_final_amount)
    RETURNING payslip_id INTO v_payslip_id;

    -- 9. Insert Details (Bonus)
    v_stt := 1;
    FOR r_bonus IN SELECT name, amount, rate FROM freelance_contract_bonus WHERE contract_id = v_contract_id LOOP
        IF (p_adjustments->'bonuses') ? r_bonus.name THEN
            v_item_amount := COALESCE(r_bonus.amount, v_contract_full_value * (r_bonus.rate / 100.0));
            INSERT INTO freelance_actual_bonus (payslip_id, stt, name, amount) 
            VALUES (v_payslip_id, v_stt, r_bonus.name, v_item_amount);
            v_stt := v_stt + 1;
        END IF;
    END LOOP;

    -- 10. Insert Details (Penalty)
    v_stt := 1;
    FOR r_penalty IN SELECT name, amount, rate FROM freelance_contract_penalty WHERE contract_id = v_contract_id LOOP
        IF (p_adjustments->'penalties') ? r_penalty.name THEN
            v_item_amount := COALESCE(r_penalty.amount, v_contract_full_value * (r_penalty.rate / 100.0));
            INSERT INTO freelance_actual_penalty (payslip_id, stt, name, amount) 
            VALUES (v_payslip_id, v_stt, r_penalty.name, v_item_amount);
            v_stt := v_stt + 1;
        END IF;
    END LOOP;

    RAISE NOTICE 'SUCCESS: Generated Freelance Payslip ID %. Contract Pay: %, Total: %', v_payslip_id, to_char(v_contract_payment, 'FM999,999,999,999'), to_char(v_final_amount, 'FM999,999,999,999');
END;
$$;

CREATE OR REPLACE VIEW view_freelance_payslip_detail AS
SELECT 
    fp.payslip_id,
    fp.payroll_id,
    fp.employee_id,
    e.f_name || ' ' || e.l_name as full_name,
    e.bank_account_number,
    fc.value as contract_total_value, -- Giá trị hợp đồng gốc để tham chiếu
    fp.final_amount, -- Thực lãnh kỳ này
    
    -- Gom nhóm Bonuses thành JSON Text
    COALESCE(
        (
            SELECT JSON_AGG(json_build_object('name', fb.name, 'amount', fb.amount))
            FROM freelance_actual_bonus fb 
            WHERE fb.payslip_id = fp.payslip_id
        ), 
        '[]'::json
    )::text as bonuses_json,

    -- Gom nhóm Penalties thành JSON Text
    COALESCE(
        (
            SELECT JSON_AGG(json_build_object('name', fp_pen.name, 'amount', fp_pen.amount))
            FROM freelance_actual_penalty fp_pen 
            WHERE fp_pen.payslip_id = fp.payslip_id
        ), 
        '[]'::json
    )::text as penalties_json

FROM freelance_payslip fp
JOIN employee_account e ON fp.employee_id = e.id
JOIN freelance_contract fc ON fp.contract_id = fc.contract_id;


