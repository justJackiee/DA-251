package com.example.demo.entity; // Lưu ý package là entity

import java.math.BigDecimal;

public interface PayslipHistoryDTO {
    Integer getMonth();
    Integer getYear();
    BigDecimal getNetPay(); // Tên chung để hứng dữ liệu từ 2 bảng khác nhau
    String getStatus();
}