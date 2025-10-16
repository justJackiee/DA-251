import TotalEmployees from '../components/Card/totalEmployees.js';
import TodayPresent from '../components/Card/todayPresent.js';
import TodayAbsent from '../components/Card/todayAbsent.js';
import TodayLeave from '../components/Card/todayLeave.js';
import PayrollCost from '../components/Card/payrollCost.js';
import RankTimeWorking from '../components/Card/rankTimeWorking.js';
import UpcomingLeave from '../components/Card/upcomingLeave.js';
import LateCheckinRanking from '../components/Card/lateChecking.js';
import React, { useState, useEffect } from 'react';

function Dashboard() {
  return (
    <div className="grid grid-cols-4 gap-1 items-start">
      <div className="flex flex-col gap-4 col-span-2 justify-end">
        <div className="flex flex-rol gap-4 col-span-2 justify-end">
          <TodayPresent />
          <TodayAbsent />
          <TodayLeave />
        </div>
        <PayrollCost />
      </div>
      <div className="flex flex-col col-span-1 justify-end gap-4 items-end">
        <TotalEmployees />
        <RankTimeWorking />
      </div>
      <div className="flex flex-col col-span-1 justify-end gap-4 items-end">
        <UpcomingLeave />
        <LateCheckinRanking />
      </div>
      
    </div>
  );
}



export default Dashboard;
