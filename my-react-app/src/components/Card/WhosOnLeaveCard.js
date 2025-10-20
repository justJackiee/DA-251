import "./WhosOnLeaveCard.css";
import { UserRound } from "lucide-react";

function WhosOnLeaveCard() {

    const todayLeaves = [
        { name: "Grace Nelson", date: "Nov 09 - Nov 13", img: "https://i.pravatar.cc/40?img=1" },
        { name: "Ryan Young", date: "Nov 09 - Nov 10", img: "https://i.pravatar.cc/40?img=2" },
    ];

    const nextWeekLeaves = [
        { name: "Brian Harris", date: "Nov 16 - Nov 18", img: "https://i.pravatar.cc/40?img=3" },
        { name: "Paula Martinez", date: "Nov 18 - Nov 20", img: "https://i.pravatar.cc/40?img=4" },
        { name: "Andrew Taylor", date: "Nov 18 - Nov 20", img: "https://i.pravatar.cc/40?img=5" },
    ];

    return (
        <div className="whosOnLeaveCard">
            {/*Header*/}
            <div className="header">
                <UserRound className="icon" size={20}></UserRound>
                <h2 className="text">Who's on leave</h2>
            </div>

            {/*Today section*/}
            <div className="todaysection">

                <h3 className="today">Today</h3>

                <ul className="listtoday">
                    {todayLeaves.map((emp, index) => (
                        <li className="list">
                        <img
                            src={emp.img}
                            alt={emp.name}
                            className="avatar"
                        />
                        <div>
                            <p className="name">{emp.name}</p>
                            <p className="date">{emp.date}</p>
                        </div>
                        </li>))
                    }
                </ul>

            </div>

            {/*Nextweek section*/}
            <div className="nextweeksection">

                <h3 className="nextweek">Next week</h3>

                <ul className="listnextweek">
                    {nextWeekLeaves.map((emp, index) => (
                        <li key={index} className="list2">
                        <img
                            src={emp.img}
                            alt={emp.name}
                            className="avatar2"
                        />
                        <div>
                            <p className="name2">{emp.name}</p>
                            <p className="date2">{emp.date}</p>
                        </div>
                        </li>))
                    }
                </ul>
                
            </div>



        </div>
    );
}

export default WhosOnLeaveCard;