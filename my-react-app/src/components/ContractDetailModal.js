import React from "react";

export default function ContractDetailModal({ contract, onClose }) {
  if (!contract) return null;
  const isFreelance = contract.value !== undefined || contract.committed_deadline !== undefined;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[95vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-900">{isFreelance ? 'Freelance Contract Details' : 'Fulltime Contract Details'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-light leading-none">
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isFreelance ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-gray-200">Basic Information</h3>
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Contract ID</label>
                    <div className="text-base text-gray-900 font-semibold">{contract.contract_id || contract.contractId || 'N/A'}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Employee ID</label>
                    <div className="text-base text-gray-900 font-semibold">{contract.employee_id || contract.employeeId || 'N/A'}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Employee Name</label>
                    <div className="text-base text-gray-900 font-semibold">{contract.employee_name || contract.employeeName || 'N/A'}</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-gray-200">Contract Period</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Start Date</label>
                    <div className="text-base text-gray-900 font-semibold">{contract.start_date || contract.startDate || 'N/A'}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">End Date</label>
                    <div className="text-base text-gray-900 font-semibold">{contract.end_date || contract.endDate || 'N/A'}</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-gray-200">Contract Value</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Value</label>
                    <div className="text-base text-gray-900 font-semibold">{contract.value ? `${Number(contract.value).toLocaleString()} VND` : (contract.value === 0 ? '0 VND' : 'N/A')}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Committed Deadline</label>
                    <div className="text-base text-gray-900 font-semibold">{contract.committed_deadline || contract.committedDeadline || 'N/A'}</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-gray-200">Status</h3>
                <div className="text-base">
                  {contract.status ? (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      contract.status === 'Active' ? 'bg-green-100 text-green-700' : (contract.status === 'Expired' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700')
                    }`}>{contract.status}</span>
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-gray-200">Contract Document</h3>
                <div className="text-gray-600">
                  {contract.document_url ? (
                    <a href={contract.document_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 font-semibold underline text-sm">📎 View Contract Document</a>
                  ) : (
                    <p className="text-gray-400 text-sm">N/A</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            // existing fulltime layout
            <div className="space-y-6">
              {/* Section 1: Basic Information */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-gray-200">Basic Information</h3>
                <div className="grid grid-cols-4 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Contract ID</label>
                    <div className="text-base text-gray-900 font-semibold">{contract.contract_id || 'N/A'}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Employee ID</label>
                    <div className="text-base text-gray-900 font-semibold">{contract.employee_id || 'N/A'}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Employee Name</label>
                    <div className="text-base text-gray-900 font-semibold">{contract.employee_name || 'N/A'}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Type</label>
                    <div className="text-base text-gray-900 font-semibold">{contract.type || 'N/A'}</div>
                  </div>
                </div>
              </div>

              {/* Section 2: Contract Dates */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-gray-200">Contract Period</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Start Date</label>
                    <div className="text-base text-gray-900 font-semibold">{contract.start_date || 'N/A'}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">End Date</label>
                    <div className="text-base text-gray-900 font-semibold">{contract.end_date || 'N/A'}</div>
                  </div>
                </div>
              </div>

              {/* Section 3: Salary & Benefits */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-gray-200">Salary & Benefits</h3>
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Base Salary</label>
                    <div className="text-base text-gray-900 font-semibold">{contract.base_salary ? `${Number(contract.base_salary).toLocaleString()} VND` : 'N/A'}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">OT Rate</label>
                    <div className="text-base text-gray-900 font-semibold">{contract.ot_rate || 'N/A'}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Annual Leave Days</label>
                    <div className="text-base text-gray-900 font-semibold">{contract.annual_leave_days || 'N/A'}</div>
                  </div>
                </div>
              </div>

              {/* Section 4: Status */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-gray-200">Status</h3>
                <div className="text-base">
                  {contract.status ? (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      contract.status === 'Active' ? 'bg-green-100 text-green-700' : (contract.status === 'Expired' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700')
                    }`}>{contract.status}</span>
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </div>
              </div>

              {/* Section 5..9 preserved as before */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-gray-200">Allowances</h3>
                <div className="text-gray-600">
                  {contract.allowances && contract.allowances.length > 0 ? (
                    <div className="space-y-2">
                      {contract.allowances.map((a, i) => (
                        <div key={i} className="flex justify-between py-1 border-b border-gray-200">
                          <span className="text-gray-700 text-sm">{a.name}</span>
                          <span className="text-gray-900 font-medium text-sm">{a.amount}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">No items added.</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-gray-200">Bonuses</h3>
                <div className="text-gray-600">
                  {contract.bonuses && contract.bonuses.length > 0 ? (
                    <div className="space-y-2">
                      {contract.bonuses.map((b, i) => (
                        <div key={i} className="flex justify-between py-1 border-b border-gray-200">
                          <span className="text-gray-700 text-sm">{b.name}</span>
                          <span className="text-gray-900 font-medium text-sm">{b.amount}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">No items added.</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-gray-200">Deductions</h3>
                <div className="text-gray-600">
                  {contract.deductions && contract.deductions.length > 0 ? (
                    <div className="space-y-2">
                      {contract.deductions.map((d, i) => (
                        <div key={i} className="flex justify-between py-1 border-b border-gray-200">
                          <span className="text-gray-700 text-sm">{d.name}</span>
                          <span className="text-gray-900 font-medium text-sm">{d.amount}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">No items added.</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-gray-200">Payment</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Payment Method</label>
                    <div className="text-base text-gray-900 font-semibold">{contract.payment_method || 'N/A'}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Bank Account Number</label>
                    <div className="text-base text-gray-900 font-semibold">{contract.bank_account || 'N/A'}</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-gray-200">Contract Document</h3>
                <div className="text-gray-600">
                  {contract.document_url ? (
                    <a href={contract.document_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 font-semibold underline text-sm">📎 View Contract Document</a>
                  ) : (
                    <p className="text-gray-400 text-sm">N/A</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
