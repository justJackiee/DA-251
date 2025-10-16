import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Calendar } from "lucide-react";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler);

export default function PayrollCost() {
  const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

  const data = {
    labels,
    datasets: [
      {
        label: "Expense",
        data: [25, 38, 35, 50, 22, 28],
        fill: true,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.4,
        pointBackgroundColor: "rgba(255, 99, 132, 1)",
      },
      {
        label: "Cost",
        data: [15, 27, 25, 35, 30, 20],
        fill: true,
        borderColor: "rgba(255, 159, 64, 1)",
        backgroundColor: "rgba(255, 159, 64, 0.2)",
        tension: 0.4,
        pointBackgroundColor: "rgba(255, 159, 64, 1)",
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          padding: 30,
          usePointStyle: true,
          boxWidth: 9,
        },
      },
      tooltip: {
        backgroundColor: "#111827",
        titleFont: { size: 14 },
        bodyFont: { size: 13 },
        padding: 12,
        displayColors: true,
        callbacks: {
          label: (context) => `$${context.parsed.y.toFixed(2)}K`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
      },
      y: {
        ticks: {
          callback: (value) => `$${value}`,
        },
        grid: {
          color: "#E5E7EB",
          borderDash: [4, 4],
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 w-full h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Payroll Cost</h2>
        <button className="flex items-center gap-1 text-gray-600 text-sm border rounded-lg px-3 py-1 hover:bg-gray-50">
          <Calendar size={16} />
          Monthly
        </button>
      </div>
      <div className="h-80">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
