BEGIN

CREATE TABLE Company_Employee (
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
    ID VARCHAR(10) PRIMARY KEY REFERENCES CompanyEmployee(ID),
    PermissionLevel INT NOT NULL
);

CREATE TABLE Employee (
    ID VARCHAR(10) PRIMARY KEY REFERENCES CompanyEmployee(ID),
    Type VARCHAR(50) NOT NULL
);

CREATE TABLE Fulltime_Contract (
    FullCon_ID VARCHAR(10) PRIMARY KEY,
    EmployeeID VARCHAR(10) REFERENCES CompanyEmployee(ID),
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
    EmployeeID VARCHAR(10) REFERENCES CompanyEmployee(ID),
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
    CE_ID         VARCHAR(10) REFERENCES CompanyEmployee(ID),        
    Payroll_ID    VARCHAR(10) REFERENCES Payroll(Payroll_ID),       
    IssuedDate    DATE NOT NULL,               
    PaymentDate   DATE,                        
    PaymentStatus VARCHAR(10) NOT NULL CHECK (PaymentStatus IN ('Paid', 'Not Paid'))
);

CREATE TABLE Leave_Request (
    LR_ID VARCHAR(10) PRIMARY KEY,
    CE_ID VARCHAR(10) REFERENCES CompanyEmployee(ID),
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
    CE_ID VARCHAR(10) REFERENCES CompanyEmployee(ID)
);

CREATE TABLE Timesheet (
    Timesheet_ID VARCHAR(10) PRIMARY KEY,
    CE_ID VARCHAR(10) REFERENCES CompanyEmployee(ID),
    HR_ID VARCHAR(10) REFERENCES HR(ID),
    Date DATE NOT NULL,
    CheckinTime TIME NOT NULL,
    CheckoutTime TIME NOT NULL,
    UpdateAt TIMESTAMP NOT NULL
)