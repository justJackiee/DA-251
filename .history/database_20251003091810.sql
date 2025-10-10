CREATE TABLE company_employee (
    ID VARCHAR(10) PRIMARY KEY,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Position VARCHAR(50),
    FName VARCHAR(50) NOT NULL,
    LName VARCHAR(50) NOT NULL,
    MName VARCHAR(50),
    Address VARCHAR(200),
    Sex CHAR(1) CHECK (Sex IN ('M','F')),
    Phone VARCHAR(20),
    Username VARCHAR(50) UNIQUE NOT NULL,
    Password VARCHAR(100) NOT NULL,
    CEType VARCHAR(20) CHECK (CEType IN ('HR','Employee'))
);

CREATE TABLE HR (
    ID VARCHAR(10) PRIMARY KEY REFERENCES company_employee(ID),
    PermissionLevel INT NOT NULL
);

CREATE TABLE Employee (
    ID VARCHAR(10) PRIMARY KEY REFERENCES company_employee(ID),
    Type VARCHAR(50) NOT NULL
);

CREATE TABLE Fulltime_Contract (
    FullCon_ID VARCHAR(10) PRIMARY KEY,
    EmployeeID VARCHAR(10) REFERENCES company_employee(ID),
    StartDate DATE NOT NULL,
    EndDate DATE,
    BaseSalary BIGINT NOT NULL,           
    AnnualLeaveDays INT NOT NULL,         
    OTRate BIGINT NOT NULL,               
    Type VARCHAR(20) CHECK (Type IN ('Có thời hạn', 'Không thời hạn'))
);

CREATE TABLE FullCon_Allowance (
    FullCon_ID VARCHAR(10) REFERENCES Fulltime_Contract(FullCon_ID),
    Allowance_ID VARCHAR(10),
    AmountPerMonth BIGINT NOT NULL,   -- Số tiền trợ cấp mỗi tháng (VNĐ)
    Name VARCHAR(100) NOT NULL,       -- Tên trợ cấp (Ăn trưa, Đi lại, Nhà ở,...)
    PRIMARY KEY (FullCon_ID, Allowance_ID)
);

CREATE TABLE FullCon_Deduction (
    FullCon_ID VARCHAR(10) REFERENCES Fulltime_Contract(FullCon_ID),
    Deduction_ID VARCHAR(10),
    Amount BIGINT NOT NULL,        
    Name VARCHAR(100) NOT NULL,   
    PRIMARY KEY (FullCon_ID, Deduction_ID)
);

CREATE TABLE FullCon_Bonus (
    FullCon_ID   VARCHAR(10) REFERENCES Fulltime_Contract(FullCon_ID),
    Bonus_ID     VARCHAR(10),
    Amount       BIGINT NOT NULL,     
    Name         VARCHAR(100) NOT NULL, 
    PRIMARY KEY (FullCon_ID, Bonus_ID)
);

CREATE TABLE Freelance_Contract (
    FreeCon_ID VARCHAR(10) PRIMARY KEY,
    EmployeeID VARCHAR(10) REFERENCES company_employee(ID),
    StartDate DATE NOT NULL,
    EndDate DATE,
    HourlyRate BIGINT NOT NULL,     
    MinHours INT NOT NULL,          
    MaxHours INT NOT NULL           
);

CREATE TABLE FreeCon_WorkDay (
    FreeCon_ID   VARCHAR(10) REFERENCES Freelance_Contract(FreeCon_ID),
    WorkDate     DATE NOT NULL,         
    TimeFrom     TIME NOT NULL,         
    TimeTo       TIME NOT NULL,         
    PRIMARY KEY (FreeCon_ID, WorkDate, TimeFrom)
);

CREATE TABLE Payroll (
    Payroll_ID    VARCHAR(10) PRIMARY KEY,  
    CreatedDate   DATE NOT NULL,            
    StartDate     DATE NOT NULL,            
    EndDate       DATE NOT NULL,          
    PayrollStatus VARCHAR(10) NOT NULL CHECK (PayrollStatus IN ('Draft', 'Final'))
);


CREATE TABLE Payslip (
    Payslip_ID    VARCHAR(10) PRIMARY KEY,     
    CE_ID         VARCHAR(10) REFERENCES company_employee(ID),        
    Payroll_ID    VARCHAR(10) REFERENCES Payroll(Payroll_ID),       
    IssuedDate    DATE NOT NULL,               
    PaymentDate   DATE,                        
    PaymentStatus VARCHAR(10) NOT NULL CHECK (PaymentStatus IN ('Paid', 'Not Paid'))
);

CREATE TABLE Leave_Request (
    LR_ID VARCHAR(10) PRIMARY KEY,
    CE_ID VARCHAR(10) REFERENCES company_employee(ID),
    HR_ID VARCHAR(10) REFERENCES HR(ID),
    LeaveType VARCHAR(50) NOT NULL CHECK (LeaveType IN ('Long Term', 'Short Term')),
    CreateAtDate DATE NOT NULL,
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    Reason TEXT,
    Status VARCHAR(20) NOT NULL CHECK (Status IN ('Approved', 'Declined'))
);

CREATE TABLE LeaveRequest_Cancel (
    LR_ID VARCHAR(10) PRIMARY KEY REFERENCES Leave_Request(LR_ID),
    CE_ID VARCHAR(10) REFERENCES company_employee(ID)
);

CREATE TABLE Timesheet (
    Timesheet_ID VARCHAR(10) PRIMARY KEY,
    CE_ID VARCHAR(10) REFERENCES company_employee(ID),
    HR_ID VARCHAR(10) REFERENCES HR(ID),
    Date DATE NOT NULL,
    CheckinTime TIME NOT NULL,
    CheckoutTime TIME NOT NULL,
    UpdateAt TIMESTAMP NOT NULL
)

-- =========================
-- Insert Company Employees
-- =========================
INSERT INTO company_employee 
(ID, Email, Position, FName, LName, MName, Address, Sex, Phone, Username, Password, CEType)
VALUES
('HR001', 'alice.hr@company.com', 'HR Manager', 'Alice', 'Nguyen', 'Thi', '123 Main St, HCMC', 'F', '0901111111', 'alicehr', 'password123', 'HR'),
('HR002', 'bob.hr@company.com', 'HR Specialist', 'Bob', 'Tran', 'Van', '456 Le Loi, HCMC', 'M', '0902222222', 'bobhr', 'password123', 'HR'),

('E001', 'john.employee@company.com', 'Software Engineer', 'John', 'Pham', 'Quoc', '789 Dien Bien Phu, HCMC', 'M', '0903333333', 'johnemp', 'password123', 'Employee'),
('E002', 'lisa.employee@company.com', 'UI/UX Designer', 'Lisa', 'Le', 'My', '12 Tran Hung Dao, HCMC', 'F', '0904444444', 'lisaemp', 'password123', 'Employee'),
('E003', 'khanh.employee@company.com', 'Accountant', 'Khanh', 'Nguyen', 'Thanh', '88 Cach Mang Thang 8, HCMC', 'M', '0905555555', 'khanhemp', 'password123', 'Employee'),
('E004', 'minh.employee@company.com', 'Marketing Specialist', 'Minh', 'Vo', 'Anh', '22 Nguyen Hue, HCMC', 'F', '0906666666', 'minhemp', 'password123', 'Employee'),
('E005', 'thao.employee@company.com', 'Business Analyst', 'Thao', 'Tran', 'Ngoc', '55 Hai Ba Trung, HCMC', 'F', '0907777777', 'thaoemp', 'password123', 'Employee'),
('E006', 'david.employee@company.com', 'DevOps Engineer', 'David', 'Ho', 'Van', '98 Pasteur, HCMC', 'M', '0908888888', 'davidemp', 'password123', 'Employee'),
('E007', 'anna.employee@company.com', 'HR Assistant', 'Anna', 'Do', 'Thi', '67 Nguyen Dinh Chieu, HCMC', 'F', '0909999999', 'annaemp', 'password123', 'Employee'),
('E008', 'peter.employee@company.com', 'Software Engineer', 'Peter', 'Le', 'Huu', '11 Pham Ngu Lao, HCMC', 'M', '0911111111', 'peteremp', 'password123', 'Employee'),
('E009', 'susan.employee@company.com', 'Project Manager', 'Susan', 'Nguyen', 'Thi', '22 Mac Dinh Chi, HCMC', 'F', '0912222222', 'susanemp', 'password123', 'Employee'),
('E010', 'tom.employee@company.com', 'Intern', 'Tom', 'Bui', 'Hoang', '44 Nguyen Trai, HCMC', 'M', '0913333333', 'tomemp', 'password123', 'Employee'),
('E011', 'hien.employee@company.com', 'Data Analyst', 'Hien', 'Pham', 'Thi', '77 Phan Xich Long, HCMC', 'F', '0914444444', 'hienemp', 'password123', 'Employee'),
('E012', 'quang.employee@company.com', 'System Admin', 'Quang', 'Hoang', 'Van', '33 Nguyen Van Troi, HCMC', 'M', '0915555555', 'quangemp', 'password123', 'Employee'),
('E013', 'mai.employee@company.com', 'Graphic Designer', 'Mai', 'Doan', 'Thi', '99 Ly Thuong Kiet, HCMC', 'F', '0916666666', 'maiemp', 'password123', 'Employee'),
('E014', 'vinh.employee@company.com', 'QA Engineer', 'Vinh', 'Le', 'Hoang', '101 Nguyen Thai Hoc, HCMC', 'M', '0917777777', 'vinhemp', 'password123', 'Employee'),
('E015', 'anh.employee@company.com', 'Frontend Developer', 'Anh', 'Tran', 'Minh', '202 Hoang Sa, HCMC', 'M', '0918888888', 'anhemp', 'password123', 'Employee'),
('E016', 'thu.employee@company.com', 'Backend Developer', 'Thu', 'Ngo', 'My', '303 Truong Sa, HCMC', 'F', '0919999999', 'thuemp', 'password123', 'Employee'),
('E017', 'long.employee@company.com', 'Product Owner', 'Long', 'Nguyen', 'Van', '404 Nguyen Van Cu, HCMC', 'M', '0921111111', 'longemp', 'password123', 'Employee'),
('E018', 'nhu.employee@company.com', 'Support Specialist', 'Nhu', 'Pham', 'Thi', '505 Hoang Dieu, HCMC', 'F', '0922222222', 'nhuemp', 'password123', 'Employee');

SELECT id, fname, lname, email, position, cetype
FROM company_employee;

-- =========================
-- HR Table
-- =========================
INSERT INTO HR (ID, PermissionLevel)
VALUES
('HR001', 3),
('HR002', 2);

SELECT id, permissionlevel
FROM HR;

-- =========================
-- Employee Table
-- =========================
INSERT INTO Employee (ID, Type)
VALUES
('E001', 'Fulltime'),
('E002', 'Fulltime'),
('E003', 'Fulltime'),
('E004', 'Fulltime'),
('E005', 'Fulltime'),
('E006', 'Fulltime'),
('E007', 'Fulltime'),
('E008', 'Fulltime'),
('E009', 'Fulltime'),
('E010', 'Freelance'),
('E011', 'Freelance'),
('E012', 'Fulltime'),
('E013', 'Fulltime'),
('E014', 'Fulltime'),
('E015', 'Fulltime'),
('E016', 'Fulltime'),
('E017', 'Fulltime'),
('E018', 'Freelance');

SELECT id, type
FROM Employee;

-- =========================
-- Fulltime Contracts
-- Company contracts start Jan 1, 2025
-- =========================
INSERT INTO Fulltime_Contract 
(FullCon_ID, EmployeeID, StartDate, EndDate, BaseSalary, AnnualLeaveDays, OTRate, Type)
VALUES
('FC001', 'E001', '2025-01-02', NULL, 20000000, 12, 200000, 'Không thời hạn'),
('FC002', 'E002', '2025-01-03', NULL, 18000000, 12, 180000, 'Không thời hạn'),
('FC003', 'E003', '2025-01-05', NULL, 15000000, 12, 150000, 'Không thời hạn'),
('FC004', 'E004', '2025-01-06', NULL, 14000000, 12, 140000, 'Không thời hạn'),
('FC005', 'E005', '2025-01-07', NULL, 17000000, 12, 170000, 'Không thời hạn'),
('FC006', 'E006', '2025-01-08', NULL, 19000000, 12, 190000, 'Không thời hạn'),
('FC007', 'E007', '2025-01-10', '2026-01-09', 12000000, 12, 120000, 'Có thời hạn'),
('FC008', 'E008', '2025-01-12', NULL, 20000000, 12, 200000, 'Không thời hạn'),
('FC009', 'E009', '2025-01-15', NULL, 22000000, 12, 220000, 'Không thời hạn'),
('FC010', 'E012', '2025-01-18', '2026-01-17', 16000000, 12, 160000, 'Có thời hạn'),
('FC011', 'E013', '2025-01-20', NULL, 13000000, 12, 130000, 'Không thời hạn'),
('FC012', 'E014', '2025-01-22', NULL, 15000000, 12, 150000, 'Không thời hạn'),
('FC013', 'E015', '2025-01-24', NULL, 17000000, 12, 170000, 'Không thời hạn'),
('FC014', 'E016', '2025-01-25', NULL, 18000000, 12, 180000, 'Không thời hạn'),
('FC015', 'E017', '2025-01-28', NULL, 25000000, 15, 250000, 'Không thời hạn');

SELECT FullCon_ID, EmployeeID, StartDate, EndDate, BaseSalary, AnnualLeaveDays, OTRate, Type
FROM Fulltime_Contract;

-- =========================
-- Freelance Contracts
-- =========================
INSERT INTO Freelance_Contract 
(FreeCon_ID, EmployeeID, StartDate, EndDate, HourlyRate, MinHours, MaxHours)
VALUES
('FR001', 'E010', '2025-01-10', '2025-06-30', 200000, 20, 120),
('FR002', 'E011', '2025-02-01', '2025-07-31', 220000, 30, 150),
('FR003', 'E018', '2025-03-01', '2025-12-31', 180000, 15, 100);

SELECT FreeCon_ID, EmployeeID, StartDate, EndDate, HourlyRate, MinHours, MaxHours
FROM Freelance_Contract;

-- =========================
-- Some Allowances for Fulltime Contracts
-- =========================
INSERT INTO FullCon_Allowance (FullCon_ID, Allowance_ID, AmountPerMonth, Name)
VALUES
('FC001', 'A001', 1000000, 'Lunch'),
('FC001', 'A002', 500000, 'Transport'),
('FC002', 'A003', 1200000, 'Housing'),
('FC009', 'A004', 1500000, 'Transport');

SELECT FullCon_ID, Allowance_ID, AmountPerMonth, Name
FROM FullCon_Allowance;

-- =========================
-- Some Deductions
-- =========================
INSERT INTO FullCon_Deduction (FullCon_ID, Deduction_ID, Amount, Name)
VALUES
('FC001', 'D001', 200000, 'Social Insurance'),
('FC002', 'D002', 300000, 'Health Insurance'),
('FC009', 'D003', 250000, 'Union Fee');

SELECT FullCon_ID, Deduction_ID, Amount, Name
FROM FullCon_Deduction;

-- =========================
-- Some Bonuses
-- =========================
INSERT INTO FullCon_Bonus (FullCon_ID, Bonus_ID, Amount, Name)
VALUES
('FC001', 'B001', 5000000, 'Tet Bonus'),
('FC009', 'B002', 7000000, 'Performance Bonus');

SELECT FullCon_ID, Bonus_ID, Amount, Name
FROM FullCon_Bonus;