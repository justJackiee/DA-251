import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import {Users} from "lucide-react";


ChartJS.register(ArcElement, Tooltip, Legend);

export default function TotalEmployees({ total = 20, fulltime = 18 }) {
  
  const fulltimepercent = (fulltime / total) * 100;
  const freelancepercent = 100 - fulltimepercent;

  const data = {
    labels: ["Fulltime", "Freelance"],
    datasets: [
      {
        data: [fulltimepercent, freelancepercent],
        backgroundColor: ["#F87171", "#FCA5A5"],
        borderWidth: 0,
        cutout: "70%",
      },
    ],
  };

  const options = {
    rotation: -90,       
    circumference: 180,
    maintainAspectRatio: false,  
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
  };

  return (
    <div className="bg-white rounded-xl shadow p-5 w-72">
        <div className="flex justify-between items-center">
            <h2 className="text-sm font-semibold text-gray-800">
                Total Employees
            </h2>
            <Users className="w-4 h-4 text-indigo-900"/>
        </div>
      <div className="relative w-48 h-48 flex justify-center mx-auto items-center -translate-y-[15%]">
        <Doughnut data={data} options={options} />
        <div className="absolute text-center top-1/2 ">
          <p className="text-xs text-gray-500">Total</p>
          <p className="text-xl font-bold text-gray-800">
            {fulltime.toLocaleString()}
            <span className="text-gray-400 text-base">/{total.toLocaleString()}</span>
          </p>
        </div>
      </div>

      <div className="flex justify-center -mt-16 space-x-6">
        <div className="flex items-center space-x-1">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
          <span className="text-xs text-gray-700">Fulltime</span>
          <span className="text-xs font-semibold text-gray-800 ml-1">
            {fulltimepercent.toFixed(0)}%
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="w-2.5 h-2.5 rounded-full bg-red-200"></span>
          <span className="text-xs text-gray-700">Freelance</span>
          <span className="text-xs font-semibold text-gray-800 ml-1">
            {freelancepercent.toFixed(0)}%
          </span>
        </div>
      </div>
    </div>
  );
}
