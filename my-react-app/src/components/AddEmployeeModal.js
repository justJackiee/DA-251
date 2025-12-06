import React, { useState } from 'react';
import axios from 'axios';
import { X, ChevronRight, ChevronLeft, FileText, Plus, Trash2 } from 'lucide-react';

const EMPLOYEE_TYPES = {
  FULLTIME: 'Fulltime',
  FREELANCE: 'Freelance'
};

const CONTRACT_TYPES = {
  INDEFINITE: 'Indefinite',
  DEFINITE: 'Definite'
};

const PAYMENT_METHODS = {
  BANK: 'Bank transfer',
  CASH: 'Cash'
};

const STEPS = [
  { number: 1, label: 'Profile detail' },
  { number: 2, label: 'Account' },
  { number: 3, label: 'Contract' }
];

const INITIAL_FORM_STATE = {
  employeeType: EMPLOYEE_TYPES.FULLTIME,
  fullName: '',
  dob: '',
  sex: 'Male',
  idNumber: '',
  phone: '',
  email: '',
  address: '',
  username: '',
  password: '',
  contractNumber: '',
  startDate: '',
  endDate: '',
  contractType: CONTRACT_TYPES.INDEFINITE,
  baseSalary: '',
  otRate: '1.5',
  annualLeaveDays: '12',
  contractValue: '',
  committedDeadline: '',
  allowances: [],
  fulltimeBonuses: [],
  deductions: [],
  freelanceBonuses: [],
  penalties: [],
  paymentMethod: PAYMENT_METHODS.BANK,
  bankAccountNumber: ''
};

const validateStep = (step, formData) => {
  const validators = {
    1: () => validateProfileStep(formData),
    2: () => validateAccountStep(formData),
    3: () => validateContractStep(formData)
  };
  
  return validators[step]?.() || false;
};

const validateProfileStep = (data) => {
  return Boolean(
    data.fullName.trim() &&
    data.dob &&
    data.email.trim() &&
    data.phone.trim() &&
    data.address.trim()
  );
};

const validateAccountStep = (data) => {
  return Boolean(
    data.username.trim() &&
    data.password.trim()
  );
};

const validateContractStep = (data) => {
  const commonValid = data.startDate !== '';
  const bankValid = data.paymentMethod === PAYMENT_METHODS.CASH || data.bankAccountNumber.trim() !== '';

  if (!commonValid || !bankValid) return false;

  if (data.employeeType === EMPLOYEE_TYPES.FULLTIME) {
    return validateFulltimeContract(data);
  }
  
  if (data.employeeType === EMPLOYEE_TYPES.FREELANCE) {
    return validateFreelanceContract(data);
  }
  
  return false;
};

const validateFulltimeContract = (data) => {
  const fulltimeValid = Boolean(
    data.baseSalary &&
    data.otRate &&
    data.annualLeaveDays
  );
  
  const endDateValid = data.contractType === CONTRACT_TYPES.INDEFINITE || data.endDate !== '';
  
  return fulltimeValid && endDateValid;
};

const validateFreelanceContract = (data) => {
  return Boolean(
    data.contractValue &&
    data.endDate &&
    data.committedDeadline
  );
};

const buildPayload = (formData) => {
  const [fName, ...lNameParts] = formData.fullName.trim().split(' ');
  const lName = lNameParts.join(' ') || '';

  return {
    fName,
    lName,
    sex: formData.sex,
    phone: formData.phone,
    email: formData.email,
    address: formData.address,
    dob: formData.dob,
    type: formData.employeeType,
    status: 'Active',
    username: formData.username,
    password: formData.password,
    bankAccountNumber: formData.paymentMethod === PAYMENT_METHODS.BANK ? formData.bankAccountNumber : null,
    contract: buildContractPayload(formData)
  };
};

const buildContractPayload = (formData) => {
  if (formData.employeeType === EMPLOYEE_TYPES.FULLTIME) {
    return {
      startDate: formData.startDate,
      endDate: formData.contractType === CONTRACT_TYPES.INDEFINITE ? null : formData.endDate,
      contractType: formData.contractType,
      baseSalary: formData.baseSalary,
      otRate: formData.otRate,
      annualLeaveDays: formData.annualLeaveDays,
      allowances: formData.allowances,
      bonuses: formData.fulltimeBonuses,
      deductions: formData.deductions
    };
  }
  
  return {
    startDate: formData.startDate,
    endDate: formData.endDate,
    contractValue: formData.contractValue,
    committedDeadline: formData.committedDeadline,
    bonuses: formData.freelanceBonuses,
    penalties: formData.penalties
  };
};

const StepIndicator = ({ steps, currentStep }) => (
  <div className="px-6 pt-6 pb-4 border-b">
    <div className="flex items-center justify-between max-w-2xl mx-auto">
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep === step.number ? 'bg-orange-500 text-white' : 
              currentStep > step.number ? 'bg-green-500 text-white' : 
              'bg-gray-200 text-gray-500'
            }`}>
              {currentStep > step.number ? '✓' : step.number}
            </div>
            <span className={`text-sm font-medium ${
              currentStep === step.number ? 'text-orange-500' : 'text-gray-500'
            }`}>
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className={`flex-1 h-0.5 mx-4 ${
              currentStep > step.number ? 'bg-green-500' : 'bg-gray-200'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  </div>
);

const DynamicSection = ({ title, listName, colorClass, icon, items, onChange, onAdd, onRemove }) => (
  <div className="bg-gray-50 rounded-lg p-4 mb-4">
    <div className="flex items-center justify-between mb-3">
      <h3 className="font-semibold flex items-center gap-2">
        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${colorClass}`}>
          {icon}
        </span>
        {title}
      </h3>
      <button 
        onClick={onAdd}
        className="text-xs bg-white border px-2 py-1 rounded hover:bg-gray-50 flex items-center gap-1"
      >
        <Plus className="w-3 h-3" /> Add
      </button>
    </div>
    
    {items.length === 0 && (
      <p className="text-xs text-gray-400 italic">No items added.</p>
    )}
    
    <div className="space-y-2">
      {items.map((item, idx) => (
        <div key={idx} className="flex gap-2">
          <input
            type="text"
            placeholder="Name"
            className="flex-1 px-2 py-1 text-sm border rounded"
            value={item.name}
            onChange={(e) => onChange(idx, 'name', e.target.value)}
          />
          <input
            type="number"
            placeholder="Amount"
            className="w-28 px-2 py-1 text-sm border rounded"
            value={item.amount}
            onChange={(e) => onChange(idx, 'amount', e.target.value)}
          />
          <button
            onClick={() => onRemove(idx)}
            className="text-red-500 hover:bg-red-50 p-1 rounded"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  </div>
);

const ProfileStep = ({ formData, onChange }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 gap-4">
      {[EMPLOYEE_TYPES.FULLTIME, EMPLOYEE_TYPES.FREELANCE].map((type) => (
        <button
          key={type}
          onClick={() => onChange('employeeType', type)}
          className={`p-4 border-2 rounded-lg text-left ${
            formData.employeeType === type
              ? 'border-orange-500 bg-orange-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="font-semibold">{type}</div>
          <div className="text-sm text-gray-500">
            {type === EMPLOYEE_TYPES.FULLTIME ? 'Standard contract' : 'Project based'}
          </div>
        </button>
      ))}
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          className="w-full px-3 py-2 border rounded-md"
          placeholder="John Doe"
          value={formData.fullName}
          onChange={(e) => onChange('fullName', e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date of Birth <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          className="w-full px-3 py-2 border rounded-md"
          value={formData.dob}
          onChange={(e) => onChange('dob', e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
        <div className="flex gap-4 mt-2">
          {['Male', 'Female', 'Other'].map(g => (
            <label key={g} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="sex"
                value={g}
                checked={formData.sex === g}
                onChange={(e) => onChange('sex', e.target.value)}
                className="text-orange-500"
              />
              <span>{g}</span>
            </label>
          ))}
        </div>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          placeholder="Email"
          className="w-full px-3 py-2 border rounded-md"
          value={formData.email}
          onChange={(e) => onChange('email', e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          placeholder="Phone"
          className="w-full px-3 py-2 border rounded-md"
          value={formData.phone}
          onChange={(e) => onChange('phone', e.target.value)}
        />
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Full Address <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        placeholder="Full Address"
        className="w-full px-3 py-2 border rounded-md"
        value={formData.address}
        onChange={(e) => onChange('address', e.target.value)}
      />
    </div>
  </div>
);

const AccountStep = ({ formData, onChange }) => (
  <div className="space-y-6 max-w-xl mx-auto">
    <div className="text-center">
      <h3 className="text-lg font-semibold">Account Setup</h3>
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">
        Username <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        className="w-full px-3 py-2 border rounded-md"
        value={formData.username}
        onChange={(e) => onChange('username', e.target.value)}
      />
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">
        Password <span className="text-red-500">*</span>
      </label>
      <input
        type="password"
        className="w-full px-3 py-2 border rounded-md"
        value={formData.password}
        onChange={(e) => onChange('password', e.target.value)}
      />
    </div>
  </div>
);

const ContractStep = ({ formData, onChange, onListChange, onAddItem, onRemoveItem }) => {
  const isFulltime = formData.employeeType === EMPLOYEE_TYPES.FULLTIME;

  return (
    <div className="space-y-6">
      {/* General Contract Info */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          ℹ {formData.employeeType} Contract Details
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Start Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border rounded-md bg-white"
              value={formData.startDate}
              onChange={(e) => onChange('startDate', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              End Date {formData.contractType !== CONTRACT_TYPES.INDEFINITE && <span className="text-red-500">*</span>}
            </label>
            <input
              type="date"
              className={`w-full px-3 py-2 border rounded-md bg-white ${
                formData.contractType === CONTRACT_TYPES.INDEFINITE ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
              value={formData.endDate}
              onChange={(e) => onChange('endDate', e.target.value)}
              disabled={formData.contractType === CONTRACT_TYPES.INDEFINITE}
            />
          </div>

          {isFulltime ? (
            <>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Contract Type</label>
                <select
                  className="w-full px-3 py-2 border rounded-md bg-white"
                  value={formData.contractType}
                  onChange={(e) => onChange('contractType', e.target.value, true)}
                >
                  <option value={CONTRACT_TYPES.INDEFINITE}>Indefinite (No End Date)</option>
                  <option value={CONTRACT_TYPES.DEFINITE}>Definite (Fixed Term)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Base Salary <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded-md bg-white"
                  value={formData.baseSalary}
                  onChange={(e) => onChange('baseSalary', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  OT Rate <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full px-3 py-2 border rounded-md bg-white"
                  value={formData.otRate}
                  onChange={(e) => onChange('otRate', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Annual Leave Days <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded-md bg-white"
                  value={formData.annualLeaveDays}
                  onChange={(e) => onChange('annualLeaveDays', e.target.value)}
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Contract Value <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded-md bg-white"
                  value={formData.contractValue}
                  onChange={(e) => onChange('contractValue', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Committed Deadline <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border rounded-md bg-white"
                  value={formData.committedDeadline}
                  onChange={(e) => onChange('committedDeadline', e.target.value)}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Dynamic Sections */}
      {isFulltime ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DynamicSection
            title="Allowances"
            listName="allowances"
            colorClass="bg-green-100 text-green-600"
            icon="+"
            items={formData.allowances}
            onChange={(idx, field, value) => onListChange('allowances', idx, field, value)}
            onAdd={() => onAddItem('allowances')}
            onRemove={(idx) => onRemoveItem('allowances', idx)}
          />
          <DynamicSection
            title="Bonuses"
            listName="fulltimeBonuses"
            colorClass="bg-green-100 text-green-600"
            icon="+"
            items={formData.fulltimeBonuses}
            onChange={(idx, field, value) => onListChange('fulltimeBonuses', idx, field, value)}
            onAdd={() => onAddItem('fulltimeBonuses')}
            onRemove={(idx) => onRemoveItem('fulltimeBonuses', idx)}
          />
          <div className="md:col-span-2">
            <DynamicSection
              title="Deductions"
              listName="deductions"
              colorClass="bg-red-100 text-red-600"
              icon="-"
              items={formData.deductions}
              onChange={(idx, field, value) => onListChange('deductions', idx, field, value)}
              onAdd={() => onAddItem('deductions')}
              onRemove={(idx) => onRemoveItem('deductions', idx)}
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DynamicSection
            title="Bonuses"
            listName="freelanceBonuses"
            colorClass="bg-green-100 text-green-600"
            icon="+"
            items={formData.freelanceBonuses}
            onChange={(idx, field, value) => onListChange('freelanceBonuses', idx, field, value)}
            onAdd={() => onAddItem('freelanceBonuses')}
            onRemove={(idx) => onRemoveItem('freelanceBonuses', idx)}
          />
          <DynamicSection
            title="Penalties"
            listName="penalties"
            colorClass="bg-red-100 text-red-600"
            icon="-"
            items={formData.penalties}
            onChange={(idx, field, value) => onListChange('penalties', idx, field, value)}
            onAdd={() => onAddItem('penalties')}
            onRemove={(idx) => onRemoveItem('penalties', idx)}
          />
        </div>
      )}

      {/* Payment */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs">
            $
          </span>
          Payment
        </h3>
        <div className="flex gap-4 mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="payMethod"
              value={PAYMENT_METHODS.BANK}
              checked={formData.paymentMethod === PAYMENT_METHODS.BANK}
              onChange={() => onChange('paymentMethod', PAYMENT_METHODS.BANK)}
              className="text-orange-500"
            />
            <span>Bank Transfer</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="payMethod"
              value={PAYMENT_METHODS.CASH}
              checked={formData.paymentMethod === PAYMENT_METHODS.CASH}
              onChange={() => onChange('paymentMethod', PAYMENT_METHODS.CASH)}
              className="text-orange-500"
            />
            <span>Cash</span>
          </label>
        </div>
        {formData.paymentMethod === PAYMENT_METHODS.BANK && (
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Bank Account Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md bg-white"
              value={formData.bankAccountNumber}
              onChange={(e) => onChange('bankAccountNumber', e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Document Upload */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs">
            📄
          </span>
          Contract Document
        </h3>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-500 cursor-pointer bg-white transition-colors group">
          <div className="flex flex-col items-center">
            <FileText className="w-8 h-8 text-gray-400 group-hover:text-orange-500 mb-2" />
            <span className="text-sm text-gray-600">
              Click to upload signed contract (PDF)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AddEmployeeModal({ onSuccess }) {
  const [showModal, setShowModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  const handleInputChange = (field, value, isContractType = false) => {
    if (isContractType) {
      setFormData(prev => ({
        ...prev,
        contractType: value,
        endDate: value === CONTRACT_TYPES.INDEFINITE ? '' : prev.endDate
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleListChange = (listName, index, field, value) => {
    const updatedList = [...formData[listName]];
    updatedList[index][field] = value;
    setFormData(prev => ({ ...prev, [listName]: updatedList }));
  };

  const addItem = (listName) => {
    setFormData(prev => ({
      ...prev,
      [listName]: [...prev[listName], { name: '', amount: '' }]
    }));
  };

  const removeItem = (listName, index) => {
    setFormData(prev => ({
      ...prev,
      [listName]: prev[listName].filter((_, i) => i !== index)
    }));
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleNext = async () => {
    if (!validateStep(currentStep, formData)) return;

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      await handleSubmit();
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const payload = buildPayload(formData);
      await axios.post('http://localhost:9000/api/employees', payload);
      handleClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add employee. Check console.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setCurrentStep(1);
    setFormData(INITIAL_FORM_STATE);
  };

  const isStepValid = validateStep(currentStep, formData);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="ml-auto px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md flex items-center gap-2"
      >
        <span className="text-xl">+</span> Add new
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-semibold">Create profile</h2>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stepper */}
            <StepIndicator steps={STEPS} currentStep={currentStep} />

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {currentStep === 1 && (
                <ProfileStep formData={formData} onChange={handleInputChange} />
              )}
              {currentStep === 2 && (
                <AccountStep formData={formData} onChange={handleInputChange} />
              )}
              {currentStep === 3 && (
                <ContractStep
                  formData={formData}
                  onChange={handleInputChange}
                  onListChange={handleListChange}
                  onAddItem={addItem}
                  onRemoveItem={removeItem}
                />
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t bg-gray-50 rounded-b-lg">
              <button
                onClick={handleBack}
                disabled={currentStep === 1}
                className={`px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2 ${
                  currentStep === 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  className="px-6 py-2 text-gray-700 hover:bg-gray-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleNext}
                  disabled={!isStepValid || loading}
                  className={`px-6 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                    !isStepValid || loading
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-orange-500 text-white hover:bg-orange-600'
                  }`}
                >
                  {loading ? 'Saving...' : currentStep === 3 ? 'Create Profile' : 'Continue'}
                  {!loading && currentStep < 3 && <ChevronRight className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}