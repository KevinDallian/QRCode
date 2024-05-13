import DashboardCard from '../../Components/Dashboard/DashboardCard';
import './Reporting.css';
import { Link } from 'react-router-dom';
import LineChart from '../../Components/Dashboard/LineChart/LineChart';
import { OptionForm } from '../../Components/FormDetail/FormDetail';
import ReportingController from './ReportingController';

export default function Reporting({}){
    const reportingController = new ReportingController();
    
    return (
        <>
            <Link to={"/"}>Back</Link>
            <div className='title'><h1>Dashboard</h1></div>
            <div className='dashboard-cards flex-row'>
                <DashboardCard text={"Order dicetak hari ini"} value={reportingController.ordersToday} subtitles={""}/>
                <DashboardCard text={"Masterbox dicetak hari ini"} value={reportingController.masterboxsToday} subtitles={""}/>
                <DashboardCard text={"Order pending hari ini"} value={50} subtitles={""}/>
            </div>
            <div className='dashboard-chart-container'>
                <div className='flex-row'>
                    <OptionForm variableName={'Produk'} options={reportingController.products.map((product)=>product.name)} value={reportingController.selectedProduct} setValue={reportingController.setSelectedProduct}/>
                </div>
                { reportingController.currentProduct && 
                <div className='flex-row'>
                    <div className='dashboard-chart'>
                        <LineChart productName={reportingController.selectedProduct}/>
                    </div>
                    <div>
                        Nama Produk : {reportingController.currentProduct.name}<br/>
                        NIE : {reportingController.currentProduct.nie}<br/>
                        HET : {reportingController.currentProduct.het}<br/>
                        Storage : {reportingController.currentProduct.storage}<br/>
                    </div>
                </div>
                }
            </div>
            
            
        </>
    )
}