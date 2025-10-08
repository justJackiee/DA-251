import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

// 🟦 Nút chính (Primary)
export const PrimaryButton = ({ text, onClick }) => (
  <button
    onClick={onClick}
    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200"
  >
    {text}
  </button>
);

// ⚪ Nút phụ (Secondary)
export const SecondaryButton = ({ text, onClick }) => (
  <button
    onClick={onClick}
    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg shadow-sm transition duration-200"
  >
    {text}
  </button>
);

// 🔍 Nút có icon (IconButton)
export const IconButton = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg shadow-md transition duration-200"
  >
    <span className="text-lg">{icon}</span>
    <span>{label}</span>
  </button>
);

// 📂 Nút Dropdown (DropdownButton)
export const DropdownButton = ({ label, options }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg shadow-md transition duration-200"
      >
        {label}
        <FaChevronDown className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => {
                option.onClick();
                setOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
