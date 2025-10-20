import React from "react";
import { Edit2, ChevronLeft } from "lucide-react";
import TOC from "./TOC";

export default function ProfileDetails() {
  const tocItems = [
    { id: "general-info", label: "General Information", level: 1 },
    { id: "job-section", label: "Job", level: 1 },
    { id: "contract-section", label: "Contract", level: 1 },
    { id: "payslip-section", label: "Payslip", level: 1 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl font-semibold">Nguyen Thi Alice</h2>
              <p className="text-sm text-gray-500">HR M</p>
            </div>
          </div>
          <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
            Full time
          </span>
        </div>
      </div>

      {/* Main content layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left content (main info) */}
        <div className="col-span-9 space-y-6">
          {/* General Information */}
          <section id="general-info" className="bg-white rounded-2xl shadow p-6">
            <SectionHeader title="General Information" />
            <SubSection title="Personal Information">
              <InfoGrid
                data={{
                  "Employee ID": "HR001",
                  Phone: "0901111111",
                  Email: "elizabethlopez95@hotmail.com",
                  Sex: "Female",
                }}
              />
            </SubSection>

            <SubSection title="Address Information">
              <InfoGrid
                data={{
                  Address: "123 Main St, HCMC",
                  Country: "Vietnam",
                  City: "Ho Chi Minh City",
                }}
              />
            </SubSection>

            <SubSection title="Education">
              <InfoGrid
                data={{
                  "2019": "Ho Chi Minh University of Technology — B.S. in Computer Science.pdf",
                }}
              />
            </SubSection>

            <SubSection title="Payment">
              <InfoGrid
                data={{
                  "Bank Account": "0123456789",
                  "Account Name": "Nguyen Thi Alice",
                  "Bank Name": "Vietcombank",
                  "Insurance Code": "AB75204",
                }}
              />
            </SubSection>
          </section>

          {/* Job Section */}
          <section id="job-section" className="bg-white rounded-2xl shadow p-6">
            <SectionHeader title="Job" />
            <SubSection title="Employment Information">
              <InfoGrid
                data={{
                  "Job Title": "UX Leader",
                  Department: "Products",
                  "Employment Type": "Full time",
                  "Start Date": "Oct 12, 2022",
                  "Contract End Date": "Oct 10, 2023",
                  "Line Manager": "Sofia Perez",
                }}
              />
            </SubSection>
          </section>

          {/* Contract Section */}
          <section id="contract-section" className="bg-white rounded-2xl shadow p-6">
            <SectionHeader title="Contract" />
            <p className="text-sm text-gray-500">Coming soon...</p>
          </section>

          {/* Payslip Section */}
          <section id="payslip-section" className="bg-white rounded-2xl shadow p-6">
            <SectionHeader title="Payslip" />
            <p className="text-sm text-gray-500">Coming soon...</p>
          </section>
        </div>

        {/* Right sidebar (TOC) */}
        <div className="col-span-3">
          <TOC items={tocItems} />
        </div>
      </div>
    </div>
  );
}

/* ------------------ Sub components ------------------ */

function SectionHeader({ title }) {
  return (
    <div className="flex justify-between items-center border-b pb-3 mb-4">
      <h3 className="font-semibold text-orange-500 flex items-center gap-2">
        <span className="border border-orange-500 rounded p-1">📋</span>
        {title}
      </h3>
      <button className="text-orange-500 text-sm flex items-center gap-1">
        <Edit2 className="w-4 h-4" /> Edit
      </button>
    </div>
  );
}

function SubSection({ title, children }) {
  return (
    <div className="mb-6">
      <h4 className="font-medium text-sm text-gray-700 mb-3">{title}</h4>
      {children}
    </div>
  );
}

function InfoGrid({ data }) {
  return (
    <div className="grid grid-cols-2 gap-y-3 gap-x-8 text-sm text-gray-700">
      {Object.entries(data).map(([key, value]) => (
        <div key={key}>
          <span className="block text-gray-400">{key}</span>
          <span>{value}</span>
        </div>
      ))}
    </div>
  );
}
