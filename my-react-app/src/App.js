import React from "react";
import { FaSearch, FaTrash } from "react-icons/fa";
import {
  PrimaryButton,
  SecondaryButton,
  IconButton,
  DropdownButton,
} from "./components/button";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
      <PrimaryButton text="Save" onClick={() => alert("Saved!")} />
      <SecondaryButton text="Cancel" onClick={() => alert("Cancelled!")} />
      <IconButton icon={<FaSearch />} label="Search" onClick={() => alert("Searching...")} />
      <IconButton icon={<FaTrash />} label="Delete" onClick={() => alert("Deleted!")} />
      <DropdownButton
        label="Select Report"
        options={[
          { label: "Monthly Report", onClick: () => alert("Monthly selected") },
          { label: "Yearly Report", onClick: () => alert("Yearly selected") },
        ]}
      />
    </div>
  );
}

export default App;
