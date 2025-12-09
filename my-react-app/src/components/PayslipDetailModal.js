import React, { useEffect, useState } from 'react';
import { PayrollService } from '../services/payrollService';

const PayslipDetailModal = ({ isOpen, onClose, record }) => {
    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch Data Logic
    useEffect(() => {
        if (isOpen && record) {
            fetchDetail();
        } else {
            setDetail(null);
            setError(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, record]);

    const fetchDetail = async () => {
        setLoading(true);
        try {
            const data = await PayrollService.getPayslipDetail(record);
            setDetail(data);
        } catch (err) {
            console.error(err);
            setError("Không thể tải chi tiết phiếu lương.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    // Helper format tiền tệ
    const formatCurrency = (val) => {
        if (val === null || val === undefined) return '0 ₫';
        return val.toLocaleString('vi-VN') + ' ₫';
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.content}>
                <button style={styles.closeBtn} onClick={onClose}>&times;</button>
                
                {loading && <div style={styles.loading}>Đang tải dữ liệu...</div>}
                
                {error && <div style={styles.error}>{error}</div>}

                {!loading && detail && (
                    <div style={styles.container}>
                        {/* Header */}
                        <div style={styles.header}>
                            <div>
                                <h2 style={styles.title}>Detailed Payslip </h2>
                                <div style={styles.employeeInfo}>
                                    <span style={styles.employeeName}>{record.fullName}</span>
                                    <span style={styles.employeeId}>#{record.employeeId || 'N/A'}</span>
                                </div>
                                <span style={record.contractType === 'FULLTIME' ? styles.badgeFulltime : styles.badgeFreelance}>
                                    {record.contractType}
                                </span>
                            </div>
                        </div>

                        {/* General Info Cards */}
                        <div style={styles.generalGrid}>
                            <div style={styles.infoCard}>
                                <label style={styles.label}>Bank Account</label>
                                <span style={styles.value}>{detail.bankAccountNumber || 'Chưa cập nhật'}</span>
                            </div>
                            <div style={styles.infoCard}>
                                <label style={styles.label}>GROSS</label>
                                <span style={styles.value}>{formatCurrency(detail.grossSalary)}</span>
                            </div>
                            <div style={{...styles.infoCard, ...styles.highlightCard}}>
                                <label style={{...styles.label}}>NET</label>
                                <span style={styles.netValue}>{formatCurrency(detail.netSalary)}</span>
                            </div>
                        </div>

                        <hr style={styles.divider} />

                        {/* Detailed Grid (3 Columns) */}
                        <div style={styles.detailGrid}>
                            {/* Column 1: Allowances */}
                            <div style={styles.column}>
                                <h3 style={styles.colHeader}>Allowances</h3>
                                <ul style={styles.list}>
                                    {detail.allowances && detail.allowances.length > 0 ? (
                                        detail.allowances.map((item, idx) => (
                                            <li key={idx} style={styles.listItem}>
                                                <span style={styles.itemName}>{item.name}</span>
                                                <span style={styles.itemVal}>{formatCurrency(item.amount)}</span>
                                            </li>
                                        ))
                                    ) : (
                                        <li style={styles.emptyItem}>No allowances</li>
                                    )}
                                </ul>
                            </div>

                            {/* Column 2: Bonuses */}
                            <div style={styles.column}>
                                <h3 style={styles.colHeader}>Bonuses</h3>
                                <ul style={styles.list}>
                                    {detail.bonuses && detail.bonuses.length > 0 ? (
                                        detail.bonuses.map((item, idx) => (
                                            <li key={idx} style={styles.listItem}>
                                                <span style={styles.itemName}>{item.name}</span>
                                                <span style={styles.itemValSuccess}>+{formatCurrency(item.amount)}</span>
                                            </li>
                                        ))
                                    ) : (
                                        <li style={styles.emptyItem}>No bonus</li>
                                    )}
                                </ul>
                            </div>

                            {/* Column 3: Deductions */}
                            <div style={styles.column}>
                                <h3 style={styles.colHeader}>Deductions</h3>
                                <ul style={styles.list}>
                                    {detail.deductions && detail.deductions.length > 0 ? (
                                        detail.deductions.map((item, idx) => (
                                            <li key={idx} style={styles.listItem}>
                                                <span style={styles.itemName}>{item.name}</span>
                                                <span style={styles.itemValDanger}>-{formatCurrency(item.amount)}</span>
                                            </li>
                                        ))
                                    ) : (
                                        <li style={styles.emptyItem}>No deduction</li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Styles Object ---
const styles = {
    overlay: {
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(2px)', // Hiệu ứng mờ nền hiện đại
    },
    content: {
        backgroundColor: '#fff',
        borderRadius: '12px',
        padding: '30px',
        width: '900px',
        maxWidth: '95%',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        fontFamily: "'Inter', sans-serif",
    },
    closeBtn: {
        position: 'absolute',
        top: '15px',
        right: '20px',
        fontSize: '28px',
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        color: '#888',
        transition: 'color 0.2s',
    },
    loading: { textAlign: 'center', padding: '40px', color: '#666', fontSize: '16px' },
    error: { textAlign: 'center', padding: '20px', color: '#dc3545', backgroundColor: '#fff5f5', borderRadius: '8px' },
    
    // Header Styles
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '24px',
    },
    title: {
        fontSize: '22px',
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: '8px',
        marginTop: 0,
    },
    idBox: {
        backgroundColor: '#f3f4f6',
        padding: '6px 12px',
        borderRadius: '6px',
        fontSize: '13px',
        color: '#555',
        fontWeight: '600',
    },

    // --- STYLES MỚI CHO THÔNG TIN NHÂN VIÊN ---
    employeeInfo: {
        marginBottom: '10px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    employeeName: {
        fontSize: '18px',
        fontWeight: '600',
        color: '#853d21ff', // Màu xanh dương đậm hơn để làm nổi bật tên
    },
    employeeId: {
        fontSize: '13px',
        color: '#6b7280',
        padding: '4px 8px',
        backgroundColor: '#f3f4f6',
        borderRadius: '4px',
    },


    badgeFulltime: {
        backgroundColor: '#e3f2fd',
        color: '#3861c2ff',
        padding: '4px 10px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    badgeFreelance: {
        backgroundColor: '#f3e5f5',
        color: '#c05bebff',
        padding: '4px 10px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
        textTransform: 'uppercase',
    },

    // Info Grid Styles
    generalGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '20px',
        marginBottom: '24px',
    },
    infoCard: {
        backgroundColor: '#ffe8c4ff',
        padding: '16px',
        borderRadius: '8px',
        border: '1px solid #ffffffff',
    },
    highlightCard: {
        backgroundColor: '#ffe8c4ff',
        borderColor: '#ffffffff',
    },
    label: {
        display: 'block',
        fontSize: '12px',
        color: '#6b7280',
        marginBottom: '4px',
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    value: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#1f2937',
    },
    netValue: {
        fontSize: '20px',
        fontWeight: '700',
        color: '#772424ff', // Màu xanh điểm nhấn
    },

    divider: {
        border: '0',
        borderTop: '1px solid #e5e7eb',
        margin: '0 0 24px 0',
    },

    // Detail Columns Styles
    detailGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '30px',
    },
    column: {
        display: 'flex',
        flexDirection: 'column',
    },
    colHeader: {
        fontSize: '14px',
        fontWeight: '700',
        color: '#374151',
        borderBottom: '2px solid #f3f4f6',
        paddingBottom: '10px',
        marginBottom: '10px',
        marginTop: 0,
    },
    list: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
    },
    listItem: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '10px 0',
        borderBottom: '1px dashed #e5e7eb',
        fontSize: '14px',
    },
    itemName: { color: '#4b5563' },
    itemVal: { fontWeight: '600', color: '#1f2937' },
    itemValSuccess: { fontWeight: '600', color: '#059669' }, // Green
    itemValDanger: { fontWeight: '600', color: '#dc2626' },   // Red
    emptyItem: { fontStyle: 'italic', color: '#9ca3af', marginTop: '10px', fontSize: '13px' },
};

export default PayslipDetailModal;