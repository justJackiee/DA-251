package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "employee_account") // Map về đúng bảng trong db.sql
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Để tự tăng theo SERIAL của Postgres
    private Long id; // Sửa String thành Long

    @Column(name = "f_name", nullable = false)
    private String fName;

    @Column(name = "m_name")
    private String mName;

    @Column(name = "l_name", nullable = false)
    private String lName;

    // Postgres dùng ENUM, Java dùng String + columnDefinition để tránh lỗi type
    @Column(name = "sex", columnDefinition = "text") 
    private String sex;

    private String phone;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(name = "bank_account_number")
    private String bankAccountNumber;

    private String address;

    private LocalDate dob;

    @Column(name = "type", nullable = false, columnDefinition = "text")
    private String type; // Fulltime/Freelance

    @Column(columnDefinition = "text")
    private String status;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;
}