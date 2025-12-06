CREATE OR REPLACE PROCEDURE sp_generate_fulltime_payslip(
    p_payroll_id BIGINT,
    p_employee_id BIGINT,
    p_actual_work_days INT,         -- Số ngày làm việc thực tế (e.workDays)
    p_ot_value DECIMAL(15, 2),      -- Tiền OT (e.ot)
    p_other_deduction DECIMAL(15, 2), -- Khấu trừ khác (e.otherDeduction)
    p_manual_bonus JSONB DEFAULT '{}'::JSONB -- Thưởng thủ công
)
LANGUAGE plpgsql
AS $$
DECLARE
    -- Hằng số từ JS Code
    WORK_DAYS_STANDARD CONSTANT INT := 26;
    SELF_DEDUCTION CONSTANT DECIMAL(15, 2) := 11000000.00;
    TAX_RATE CONSTANT DECIMAL(5, 2) := 0.1;

    -- Biến lưu trữ giá trị từ DB
    v_contract_id INT;
    v_base_salary DECIMAL(15, 2); -- Lương cơ bản trong HĐ

    -- Biến tính toán
    v_payslip_id INT;
    v_responsibility_allowance DECIMAL(15, 2) := 0; -- responsibility (Taxed)
    v_living_allowance DECIMAL(15, 2) := 0; -- living (Taxed)
    v_travel_allowance DECIMAL(15, 2) := 0; -- travel (Untaxed)
    
    v_holiday_bonus DECIMAL(15, 2) := 0;
    v_other_bonus DECIMAL(15, 2) := 0;

    v_total_taxed_allowance DECIMAL(15, 2); -- Responsibility + Living
    v_total_bonus DECIMAL(15, 2); -- Holiday + Other

    v_total_taxable_base DECIMAL(15, 2); -- Base + Taxed Allowance + Total Bonus (TRƯỚC khi prorate)
    v_total_income DECIMAL(15, 2);       -- Tổng thu nhập GROSS sau khi prorate (totalIncome)

    v_bhxh DECIMAL(15, 2);
    v_bhyt DECIMAL(15, 2);
    v_bhtn DECIMAL(15, 2);
    v_total_statutory_deduction DECIMAL(15, 2);
    
    v_taxable_income DECIMAL(15, 2); -- Thu nhập tính thuế (Gross Income - Statutory - Self Deduction - Other Deduction)
    v_tax DECIMAL(15, 2);            -- Thuế TNCN
    v_net_income DECIMAL(15, 2);     -- Lương thực nhận

BEGIN
    -- 1. Lấy Hợp đồng hiện tại và Lương cơ bản
    SELECT contract_id, base_salary
    INTO v_contract_id, v_base_salary
    FROM fulltime_contract
    WHERE employee_id = p_employee_id
    ORDER BY start_date DESC LIMIT 1;

    IF v_contract_id IS NULL THEN
        RAISE NOTICE 'No active fulltime contract found for Employee ID %', p_employee_id;
        RETURN;
    END IF;

    -- 2. Tính toán Allowances & Bonuses theo HĐ và Manual
    -- Allowances
    SELECT COALESCE(SUM(CASE WHEN name = 'Responsibility Allowance' THEN amount ELSE 0 END), 0),
           COALESCE(SUM(CASE WHEN name = 'Living Allowance' THEN amount ELSE 0 END), 0),
           COALESCE(SUM(CASE WHEN name = 'Travel Allowance' THEN amount ELSE 0 END), 0)
    INTO v_responsibility_allowance, v_living_allowance, v_travel_allowance
    FROM fulltime_contract_allowance
    WHERE contract_id = v_contract_id;

    -- Bonuses từ manual_bonus (JSONB)
    IF p_manual_bonus IS NOT NULL THEN
        v_holiday_bonus := COALESCE((p_manual_bonus->>'holiday')::DECIMAL, 0);
        v_other_bonus := COALESCE((p_manual_bonus->>'other')::DECIMAL, 0);
    END IF;

    -- Tổng hợp các khoản
    v_total_taxed_allowance := v_responsibility_allowance + v_living_allowance;
    v_total_bonus := v_holiday_bonus + v_other_bonus;

    -- 3. Tính toán Tổng thu nhập (Total Taxable Base & Gross Income)
    v_total_taxable_base := v_base_salary + v_total_taxed_allowance + v_total_bonus;

    -- Công thức Prorating: ((Base + Taxed Allowance + Bonus) / WORK_DAYS_STANDARD) * WorkDays
    v_total_income := (v_total_taxable_base / WORK_DAYS_STANDARD) * p_actual_work_days;
    
    -- 4. Tính toán Khấu trừ bắt buộc (BHXH, BHYT, BHTN)
    v_bhxh := v_base_salary * 0.08;
    v_bhyt := v_base_salary * 0.015;
    v_bhtn := v_base_salary * 0.01;
    v_total_statutory_deduction := v_bhxh + v_bhyt + v_bhtn;
    
    -- 5. Tính Thu nhập tính thuế (Taxable Income)
    -- Công thức: Gross Income - Statutory Deduction - Self Deduction - Other Deduction
    v_taxable_income := GREATEST(0, v_total_income - SELF_DEDUCTION - v_total_statutory_deduction - p_other_deduction);

    -- 6. Tính Thuế TNCN (Dựa trên Taxable Income)
    v_tax := v_taxable_income * TAX_RATE;

    -- 7. Tính Lương thực nhận (Net Income)
    -- Net Income = Gross Income - Statutory Deduction - Tax + Untaxed Allowance + OT
    v_net_income := v_total_income
                      - v_total_statutory_deduction
                      - v_tax
                      + v_travel_allowance
                      + p_ot_value;

    -- 8. Ghi dữ liệu vào Payslip Header
    -- Xóa cũ nếu đã tồn tại
    DELETE FROM fulltime_payslip WHERE payroll_id = p_payroll_id AND employee_id = p_employee_id;

    INSERT INTO fulltime_payslip (payroll_id, employee_id, contract_id, gross_salary, net_salary)
    VALUES (p_payroll_id, p_employee_id, v_contract_id, v_total_taxable_base, v_net_income)
    RETURNING payslip_id INTO v_payslip_id;

    -- 9. Ghi chi tiết (Ghi các khoản tính toán vào các bảng chi tiết Payslip)

    -- Allowance
    INSERT INTO fulltime_actual_allowance (payslip_id, stt, name, amount) VALUES
    (v_payslip_id, 1, 'Responsibility Allowance', COALESCE(v_responsibility_allowance, 0)),
    (v_payslip_id, 2, 'Living Allowance', COALESCE(v_living_allowance, 0)),
    (v_payslip_id, 3, 'Travel Allowance', COALESCE(v_travel_allowance, 0));

    -- Bonus
    INSERT INTO fulltime_actual_bonus (payslip_id, stt, name, amount) VALUES
    (v_payslip_id, 1, 'Holiday Bonus', COALESCE(v_holiday_bonus, 0)),
    (v_payslip_id, 2, 'Other Bonus', COALESCE(v_other_bonus, 0));
    
    -- Deduction (Ghi lại chi tiết khấu trừ)
    INSERT INTO fulltime_payslip_deduction (payslip_id, stt, name, amount) VALUES
    (v_payslip_id, 1, 'Self Deduction (TNCN)', SELF_DEDUCTION), -- Đã thêm Khấu trừ bản thân
    (v_payslip_id, 2, 'BHXH (8%)', v_bhxh),
    (v_payslip_id, 3, 'BHYT (1.5%)', v_bhyt),
    (v_payslip_id, 4, 'BHTN (1%)', v_bhtn),
    (v_payslip_id, 5, 'Khấu trừ khác', p_other_deduction),
    (v_payslip_id, 6, 'Thuế TNCN (10%)', v_tax);

    RAISE NOTICE 'Generated Payslip ID % for Employee %: Total Income (Gross Prorated) = %, Net Income = %', v_payslip_id, p_employee_id, v_total_income, v_net_income;
END;
$$;