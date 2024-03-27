import './Agregasi.css';
import ActionButton from '../../Components/ActionButton/ActionButton';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import {EndModal, JobList, JobModal} from '../Serialisasi/Serialisasi';
import ReactTable from '../../Components/Table/ReactTable';
import Modal from '../../Components/Modal/Modal';
import Barcode from 'react-jsbarcode';

export default function Agregasi(){
    const headers = ['No', 'Order ID', 'Masterbox ID', 'Manufacture Date', 'Status'];
    const [showJobModal, setShowJobModal] = useState(false);
    const [showEndModal, setShowEndModal] = useState(false);
    const [showPrintModal, setShowPrintModal] = useState(false);
    const [currentJob, setCurrentJob] = useState({});
    const [scannedData, setScannedData] = useState([]);
    const [printData, setPrintData] = useState(null);

    const jobs = [
        {id : "J001", productID : "PR001", batchNo : "23032024/01", expiredDate : new Date("2024-03-29").toString(), quantity : 10, jobStatus : "Active"},
    ];
    
    const loadJob = (index) => {
        const job = jobs[index];
        setCurrentJob(job);
    }

    const endJob = () => {
        const updatedJob = currentJob;
        updatedJob.jobStatus = "Ended";
        setCurrentJob(updatedJob);
        toggleModal("EndModal");
    }

    const endPrint = () => {
        setScannedData([]);
        toggleModal("PrintModal");
    }

    const toggleModal = (modalType) => {
        if (modalType === "JobModal") {
            setShowJobModal(!showJobModal);
        } else if (modalType === "EndModal") {
            setShowEndModal(!showEndModal);
        } else if (modalType === "PrintModal") {
            setShowPrintModal(!showPrintModal);
        }
        
    }

    const formatDate = (date) => {
        if (!date) return "";
        if (date instanceof Date) {
            return date.toISOString().split('T')[0];
        } else {
            return new Date(date).toISOString().split('T')[0];
        }
    }

    const scanOrder = () => {
        const randomID = Math.floor(Math.random() * 100);
        const generatedID = `OR${(randomID).toString().padStart(3, "0")}`;
        const index = scannedData.length + 1;
        const newData = {
            no : index,
            orderID : generatedID,
            masterboxID : "",
            manufactureDate : new Date("2024/04/22"),
            orderStatus : "Printed"
        };
        setScannedData([...scannedData, newData]);
    }

    const printMasterBox = () => {
        const data = {
            productName : "Obat Insto",
            masterboxID : "MB001",
            nie : "DTL2038202646A1",
            expiredDate : formatDate(currentJob.expiredDate),
            quantity : currentJob.quantity,
            storage : "Suhu dibawah 30C",
            manufacturer : "PT Pharma Health Care Indonesia",
            batchNo : currentJob.batchNo,
        };
        setPrintData(data);
        toggleModal("PrintModal");
    }

    return (
        <>
            <Link to='/'>Back</Link>
            <h1 className='title'>Agregasi</h1>
            {showJobModal && <JobModal toggleModal={()=>toggleModal("JobModal")} loadJob={loadJob} jobs={jobs}/>}
            {showEndModal && <EndModal toggleModal={()=>toggleModal("EndModal")} endJob={endJob}/>}
            {showPrintModal && <PrintModal data={printData} toggleModal={()=>endPrint()}/>}
            <div className='flex-row job-display'>
                <div className='col'>
                    <JobList name={"Job ID"} detail={currentJob.id}/>
                    <JobList name={"Produk"} detail={currentJob.productID}/>
                    <JobList name={"Batch No"} detail={currentJob.batchNo} />
                </div>
                <div className='col'>
                    <JobList name={"Order Quantity"} detail={currentJob.quantity}/>
                    <JobList name={"Expired Date"} detail={formatDate(currentJob.expiredDate)}/>
                    <JobList name={"Job Status"} detail={currentJob.jobStatus}/>
                </div>
                <div className='flex-column'>
                    <ActionButton name={"Load Job"} onClickFunction={()=>{toggleModal("JobModal")}}/>
                    <ActionButton name={"End Job"} onClickFunction={()=> {toggleModal("EndModal")}} disabled={Object.keys(currentJob).length === 0}/>
                </div>
                <div className='flex-column'>
                    <ActionButton name={"Print"} onClickFunction={()=> {printMasterBox()}} disabled={scannedData.length < currentJob.quantity || Object.keys(currentJob).length === 0}/>
                    <ActionButton name={"Scan"} onClickFunction={()=> {scanOrder()}} disabled={Object.keys(currentJob).length === 0 || scannedData.length === currentJob.quantity}/>
                </div>
            </div>

            <div id='table'>
                <ReactTable headers={headers} datas={scannedData} onClickHandler={(e)=>{console.log(e)}}/>
            </div>
        </>
    );
}

function PrintModal({data, toggleModal}) {
    
    return (
        <Modal width='40vw'>
            <div>
                <h1>{data.productName}</h1>
                <div className='flex-space-between'>
                    <div className='product-details'>
                        <table className='border-table'>
                            <tbody>
                                <tr>
                                    <th>NIE</th>
                                    <td className='modal-data'>{data.nie}</td>
                                </tr>
                                <tr>
                                    <th>Expired Date</th>
                                    <td className='modal-data'>{data.expiredDate}</td>
                                </tr>
                                <tr>
                                    <th>QTY per box</th>
                                    <td className='modal-data'>{data.quantity}</td>
                                </tr>
                                <tr>
                                    <th>Storage</th>
                                    <td className='modal-data'>{data.storage}</td>
                                </tr>
                            </tbody>
                            
                        </table>
                    </div>
                    <div>
                        <p style={{fontWeight:"bold"}}>Manufactured by :</p>
                        <p>{data.manufacturer}</p>
                    </div>
                </div>
                
            </div>
            <div id='barcode'>
                <p>Batch : {data.batchNo}</p>
                <Barcode value={data.masterboxID} options={{ format: 'code128' }} renderer="svg"/>
            </div>
            <ActionButton id='printBtn' name={"Print"} onClickFunction={()=>{toggleModal()}}/>
        </Modal>
    );
}