import React from "react";

function CEmployeeTable() {
    const TABLE_HEAD = ["ID", "Full Name", "Position", "Email", "Phone", "Sex", "Type", "Action"];

    const TABLE_ROWS = [
        { ID: "HR001", Email: "alice.hr@company.com", Position: "HR Manager", FName: "Alice", LName: "Nguyen", MName: "Thi", Address: "123 Main St, HCMC", Sex: "F", Phone: "0901111111", Username: "alicehr", Password: "password123", CEType: "HR" },
        { ID: "HR002", Email: "bob.hr@company.com", Position: "HR Specialist", FName: "Bob", LName: "Tran", MName: "Van", Address: "456 Le Loi, HCMC", Sex: "M", Phone: "0902222222", Username: "bobhr", Password: "password123", CEType: "HR" },
        { ID: "E001", Email: "john.employee@company.com", Position: "Software Engineer", FName: "John", LName: "Pham", MName: "Quoc", Address: "789 Dien Bien Phu, HCMC", Sex: "M", Phone: "0903333333", Username: "johnemp", Password: "password123", CEType: "Employee" },
        { ID: "E002", Email: "lisa.employee@company.com", Position: "UI/UX Designer", FName: "Lisa", LName: "Le", MName: "My", Address: "12 Tran Hung Dao, HCMC", Sex: "F", Phone: "0904444444", Username: "lisaemp", Password: "password123", CEType: "Employee" },
        { ID: "E003", Email: "khanh.employee@company.com", Position: "Accountant", FName: "Khanh", LName: "Nguyen", MName: "Thanh", Address: "88 Cach Mang Thang 8, HCMC", Sex: "M", Phone: "0905555555", Username: "khanhemp", Password: "password123", CEType: "Employee" },
        { ID: "E004", Email: "minh.employee@company.com", Position: "Marketing Specialist", FName: "Minh", LName: "Vo", MName: "Anh", Address: "22 Nguyen Hue, HCMC", Sex: "F", Phone: "0906666666", Username: "minhemp", Password: "password123", CEType: "Employee" },
        { ID: "E005", Email: "thao.employee@company.com", Position: "Business Analyst", FName: "Thao", LName: "Tran", MName: "Ngoc", Address: "55 Hai Ba Trung, HCMC", Sex: "F", Phone: "0907777777", Username: "thaoemp", Password: "password123", CEType: "Employee" },
        { ID: "E006", Email: "david.employee@company.com", Position: "DevOps Engineer", FName: "David", LName: "Ho", MName: "Van", Address: "98 Pasteur, HCMC", Sex: "M", Phone: "0908888888", Username: "davidemp", Password: "password123", CEType: "Employee" },
        { ID: "E007", Email: "anna.employee@company.com", Position: "HR Assistant", FName: "Anna", LName: "Do", MName: "Thi", Address: "67 Nguyen Dinh Chieu, HCMC", Sex: "F", Phone: "0909999999", Username: "annaemp", Password: "password123", CEType: "Employee" },
        { ID: "E008", Email: "peter.employee@company.com", Position: "Software Engineer", FName: "Peter", LName: "Le", MName: "Huu", Address: "11 Pham Ngu Lao, HCMC", Sex: "M", Phone: "0911111111", Username: "peteremp", Password: "password123", CEType: "Employee" },
        { ID: "E009", Email: "susan.employee@company.com", Position: "Project Manager", FName: "Susan", LName: "Nguyen", MName: "Thi", Address: "22 Mac Dinh Chi, HCMC", Sex: "F", Phone: "0912222222", Username: "susanemp", Password: "password123", CEType: "Employee" },
        { ID: "E010", Email: "tom.employee@company.com", Position: "Intern", FName: "Tom", LName: "Bui", MName: "Hoang", Address: "44 Nguyen Trai, HCMC", Sex: "M", Phone: "0913333333", Username: "tomemp", Password: "password123", CEType: "Employee" },
    ];

    return (
        <div className="flex justify-center mt-10 px-4">
            <div className="w-full max-w-6xl bg-white shadow-lg rounded-xl overflow-hidden">
                {/* Header */}
                <div className="bg-blue-600 text-white text-center py-4 font-semibold text-xl">
                    Employee List
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-100 text-gray-700">
                                {TABLE_HEAD.map((head) => (
                                    <th
                                        key={head}
                                        className="py-3 px-4 text-left font-semibold border-b"
                                    >
                                        {head}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {TABLE_ROWS.map((emp, index) => (
                                <tr
                                    key={emp.ID}
                                    className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                                        } hover:bg-blue-50 transition`}
                                >
                                    <td className="py-3 px-4 text-left border-b">{emp.ID}</td>
                                    <td className="py-3 px-4 text-left border-b">
                                        {emp.FName} {emp.MName} {emp.LName}
                                    </td>
                                    <td className="py-3 px-4 text-left border-b">{emp.Position}</td>
                                    <td className="py-3 px-4 text-left border-b">{emp.Email}</td>
                                    <td className="py-3 px-4 text-left border-b">{emp.Phone}</td>
                                    <td className="py-3 px-4 text-left border-b">{emp.Sex}</td>
                                    <td className="py-3 px-4 text-left border-b">{emp.CEType}</td>
                                    <td className="py-3 px-4 text-left border-b">
                                        <button className="text-blue-600 hover:underline font-medium">
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="text-gray-500 text-sm text-right p-3 border-t">
                    Showing {TABLE_ROWS.length} employees
                </div>
            </div>
        </div>
    );
}

export default CEmployeeTable;
