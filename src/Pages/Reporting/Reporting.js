import DashboardCard from '../../Components/Dashboard/DashboardCard';
import './Reporting.css';
import { Link } from 'react-router-dom';
import LineChart from '../../Components/Dashboard/LineChart/LineChart';
import { OptionForm } from '../../Components/FormDetail/FormDetail';
import { useState, useEffect } from 'react';
import ReportingController from './ReportingController';

export default function Reporting({jobs, products, orders, masterboxs}){
    const [currentProduct, setCurrentProduct] = useState('');
    const [selectedProduct, setSelectedProduct] = useState('');
    const reportingController = new ReportingController();
    useEffect(() => {
        selectProduct(selectedProduct);
    }, [selectedProduct]);

    function formatDate(date) {
        if (!date) return "";
        if (date instanceof Date) {
            return date.toISOString().split('T')[0];
        } else {
            return new Date(date).toISOString().split('T')[0];
        }
    }

    const selectProduct = (selectedProduct) => {
        const product = products.find((product) => product.name === selectedProduct);
        if (product) {
            const productID = product.id;
            const productJobs = jobs.filter((job) => job.productID === productID);
            const productOrders = orders.filter((order) => order.productID === productID);
            const productMasterboxs = masterboxs.filter((masterbox) => masterbox.productID === productID);
            const data = {
                product: product,
                jobs: productJobs,
                orders: productOrders,
                masterboxs: productMasterboxs
            };
            setCurrentProduct(data);
        }
        return null;
    }
    return (
        <>
            <Link to={"/"}>Back</Link>
            <div className='title'><h1>Dashboard</h1></div>
            <div className='dashboard-cards flex-row'>
                <DashboardCard text={"Order dicetak hari ini"} value={reportingController.calculateOrderPrintedToday(orders)} subtitles={"+2% dari kemarin"}/>
                <DashboardCard text={"Masterbox dicetak hari ini"} value={reportingController.calculateMasterboxPrintedToday(masterboxs)} subtitles={"-3% dari kemarin"}/>
                <DashboardCard text={"Order pending hari ini"} value={50} subtitles={""}/>
            </div>
            <div className='dashboard-chart-container'>
                <div className='flex-row'>
                    <OptionForm variableName={'Produk'} options={products.map((product)=>product.name)} value={selectedProduct} setValue={setSelectedProduct}/>
                </div>
                { currentProduct && 
                <div className='flex-row'>
                    <div className='dashboard-chart'>
                        <LineChart productName={selectedProduct}/>
                    </div>
                    <div>
                        Nama Produk : {currentProduct.product.name}<br/>
                        NIE : {currentProduct.product.nie}<br/>
                        HET : {currentProduct.product.het}<br/>
                        Storage : {currentProduct.product.storage}<br/>
                    </div>
                </div>
                }
            </div>
            
            
        </>
    )
}