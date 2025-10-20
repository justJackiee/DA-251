import React from "react";
import TimeTrackingFilters from "../components/Filters";
import TimeTrackingTable from "../components/Table/TimeTrackingTable";
//import Pagination from "../components/Pagination";
import TrackingButtons from "../components/button"

export default function TimeTracking() {
  return (
    <div className="p-6">
        {/*Tiêu đề*/}
        <div>
        <h2 className="text-xl font-bold mb-6 text-gray-900">Time Tracking</h2>
        </div>

        {/*3 buttons*/}
        <div className="flex justify-end mb-4">
            <TrackingButtons />
        </div>

        {/*Clear All Filters */}
        <div className="flex justify-end items-center px-3">
            <button className="text-gray-500 text-sm hover:underline">Clear filters</button>
        </div>
        

        {/*Filter Bar*/}
        <div>
            <div className="px-3">
                <TimeTrackingFilters />
            </div>
            
            <div className="px-3">
                <TimeTrackingTable />
            </div>
        </div>
    </div>
  );
}

