import "./TotalEmployeesCard.css";
import { Chart as ChartJS } from "chart.js/auto";
import { Doughnut } from "react-chartjs-2";

function TotalEmployeesCard () {
    const fulltime = 15;
    const total = 20;
    const percentOnboarding = ((fulltime / total) * 100).toFixed(0);
    const percentOffboarding = 100 - percentOnboarding;

    const data = {
        labels: ["Fulltime", "Freelance"],
        datasets: [
        {
            label: "Count",
            data: [15, 5],
            backgroundColor: ["#36A2EB", "#FF6384"],
            circumference: 180,
            rotation: 270
        },
        ],
    }

    const options = { 
        aspectRatio: 2
    }


    return (
        <div className="totalEmployeesCard">
            {/*Header*/}
            <h2 className="text">Total Employees</h2>
            <span className="icon">
            •••
            </span>

            {/*Chart*/}
            <div className="chart" style={{ width: "500px", height: "125px" }}>
                <Doughnut
                    data={data}
                    options={options}
                />
                <p className="text-chart1">Total</p>
                <p className="text-chart2">{fulltime.toLocaleString()}/{total.toLocaleString()}
                </p>
            </div>

            {/*Stats below*/}
            <div className="fulltime">Fulltime 
                <p className="percent1">{percentOnboarding}%</p></div>
            <div className="freelance">Freelance 
                <p className="percent2">{percentOffboarding}%</p></div>
            
        </div>
    );
}

export default TotalEmployeesCard