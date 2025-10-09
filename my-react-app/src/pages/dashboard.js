import TotalEmployeesCard from '../components/Card/TotalEmployeesCard';
import WhosOnLeaveCard from "../components/Card/WhosOnLeaveCard";
import { NewComersCard } from "../components/Card/NewComersCard";
import UpComingCard from "../components/Card/UpComingCard";

function Dashboard() {
    return (<>
    <TotalEmployeesCard/>
    <WhosOnLeaveCard/>
    {/*<NewComersCard/>*/}
    <UpComingCard/>
    </>);
    
};


export default Dashboard;