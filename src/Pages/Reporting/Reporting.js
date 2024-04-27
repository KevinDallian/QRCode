import DashboardCard from '../../Components/Dashboard/DashboardCard';
import './Reporting.css';
import { Link } from 'react-router-dom';

export default function Reporting({jobs, products, orders, masterboxs}){

    function formatDate(date) {
        if (!date) return "";
        if (date instanceof Date) {
            return date.toISOString().split('T')[0];
        } else {
            return new Date(date).toISOString().split('T')[0];
        }
    }
    return (
        <>
            <Link to={"/"}>Back</Link>
            <div className='title'><h1>Dashboard</h1></div>
            <div className='dashboard-cards flex-row'>
                <DashboardCard text={"Order dicetak hari ini"} value={200} subtitles={"+2% dari kemarin"}/>
                <DashboardCard text={"Masterbox dicetak hari ini"} value={200} subtitles={"-3% dari kemarin"}/>
                <DashboardCard text={"Order pending hari ini"} value={products.length} subtitles={""}/>
            </div>
        </>
    )
}