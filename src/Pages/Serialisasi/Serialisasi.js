import './Serialisasi.css';
import { Link } from 'react-router-dom';
import ActionButton from '../../Components/ActionButton/ActionButton';
import ReactTable from '../../Components/Table/ReactTable';
import { useState } from 'react';
import Modal from '../../Components/Modal/Modal';
import QRCode from 'react-qr-code';

export default function Serialisasi({jobs, products, globalOrders, setGlobalOrders}){
    const headers = ['No', 'Order ID', 'Job ID', 'Masterbox ID', 'Manufacture Date', 'Status'];
    const [showJobModal, setShowJobModal] = useState(false);
    const [showEndModal, setShowEndModal] = useState(false);
    const [currentJob, setCurrentJob] = useState({});
    const [showPrintModal, setShowPrintModal] = useState(false);
    const [orders, setOrders] = useState([]);

    const loadJob = (index) => {
        const job = jobs[index];
        const product = products.find((product) => product.id === job.productID);
        setCurrentJob(job);
        console.log(job);
        if (globalOrders.some((order) => order.jobID === job.id)) {
            const orders = globalOrders.filter((order) => order.jobID === job.id);
            setOrders(orders);
        } else {
            generateData(job, product);
        }
    }

    const endJob = () => {
        const updatedJob = currentJob;
        updatedJob.jobStatus = "Ended";
        setCurrentJob(updatedJob);
        toggleModal("EndModal");
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

    const endPrint = () => {
        setOrders([]);
        toggleModal("PrintModal");
    }

    const formatDate = (date) => {
        if (!date) return "";
        if (date instanceof Date) {
            return date.toISOString().split('T')[0];
        } else {
            return new Date(date).toISOString().split('T')[0];
        }
    }

    const generateData = (job, product) => {
        let generatedData = [];
        for (let i=0;i<job.productQty;i++) {
            const existingDataLength = generatedData.length;
            const generatedID = `(90)${product.nie}(91)${job.expiredDate}(00)${job.batchNo}(01)${(existingDataLength+1).toString().padStart(3, "0")}`;
            const newData = {
                id : generatedID,
                jobID : job.id,
                masterboxID : "",
                manufactureDate : new Date().toString(),
                status : "Not Printed"
            };
            generatedData.push(newData);
        }
        setOrders(generatedData);
        setGlobalOrders([...globalOrders, ...generatedData]);
    }

    return (
        <>
            {showJobModal && <JobModal toggleModal={()=>toggleModal("JobModal")} loadJob={loadJob} jobs={jobs}/>}
            <Link to='/'>Back</Link>
            {showEndModal && <EndModal toggleModal={()=>toggleModal("EndModal")} endJob={endJob}/>}
            {showPrintModal && <PrintModal data={orders} toggleModal={()=>endPrint()} job={currentJob}/>}
            <h1 className='title'>Serialisasi</h1>
            <div className='flex-row job-display'>
                <div className='col'>
                    <JobList name={"Job ID"} detail={currentJob.id}/>
                    <JobList name={"Produk"} detail={currentJob.productID}/>
                    <JobList name={"Batch No"} detail={currentJob.batchNo} />
                </div>
                <div className='col'>
                    <JobList name={"Order Quantity"} detail={currentJob.productQty}/>
                    <JobList name={"Expired Date"} detail={formatDate(currentJob.expiredDate)}/>
                    <JobList name={"Job Status"} detail={currentJob.jobStatus}/>
                </div>
                <div className='flex-column'>
                    <ActionButton name={"Load Job"} onClickFunction={()=>{toggleModal("JobModal")}}/>
                    <ActionButton name={"End Job"} onClickFunction={()=> {toggleModal("EndModal")}} disabled={Object.keys(currentJob).length === 0}/>
                </div>
                <div className='flex-column'>
                    <ActionButton name={"Print"} onClickFunction={()=> {toggleModal("PrintModal")}}/>
                    <ActionButton name={"Test Print"} onClickFunction={()=> {console.log("Test Print")}}/>
                    <ActionButton name={"Stop Print"} onClickFunction={()=> {console.log("Stop Print")}}/>
                </div>
            </div>
            <div className='print-status'>
                <p>Quantity Scanned :</p>
                <p>Success          :</p>
                <p>Skipped          :</p>
                <p>Cancelled        :</p>
            </div>
            <div id='table-serialisasi'>
                <ReactTable headers={headers} datas={orders} onClickHandler={(e)=>{console.log(e)}}/>
            </div>
        </>
    );
}

export function JobList({name, detail}) {
    return (
        <div className='flex-space-between joblist-box'>
            <h3 className='name'>{name}</h3>
            <h3 className='detail'>{detail}</h3>
        </div>
    );
}

export function JobModal({toggleModal, loadJob, jobs}) {
    const [currentIndex, setCurrentIndex] = useState(null);
    const modalHeaders = ["No", "ID Job", "ID Produk", "Batch No", "Expired Date", "Top Aggregation Quantity", "Order Quantity", "Job Status"];

    const onClickTableModal = (index) => {
        setCurrentIndex(index);
    }

    const setJob = (jobIndex) => {
        loadJob(jobIndex);
        toggleModal();
    }

    return (
        <Modal>
            <div className='flex-space-between'>
                <h1>Load Job</h1>
                <div className='flex-column'>
                    <button className='modal-btn' onClick={()=>{setJob(currentIndex)}}>Load</button>
                    <button className='modal-btn' onClick={toggleModal}>Cancel</button>
                </div>
            </div>
            <div className=''>
                <ReactTable headers={modalHeaders} datas={jobs} currentIndex={currentIndex} onClickHandler={onClickTableModal}/>
            </div>
        </Modal>
    );
}

export function EndModal({toggleModal, endJob}){
    return (
        <Modal>
            <h1>End Job</h1>
            <p>Apakah ingin melakukan End Job?</p>
            <div className='flex-row'>
                <button onClick={toggleModal}>Cancel</button>
                <button onClick={()=>{endJob()}}>End</button>
            </div>
        </Modal>
    );
}

function PrintModal({data, toggleModal, job}) {
    const formatDate = (date) => {
        if (!date) return "";
        if (date instanceof Date) {
            return date.toISOString().split('T')[0];
        } else {
            return new Date(date).toISOString().split('T')[0];
        }
    }

    const dataToBePrinted = data.map((data, index) => {
        return (
            <div key={index} className='modal-border flex-space-between'>
                <table id='table'>
                    <tbody>
                        <tr>
                            <th>No. Batch</th>
                            <td>{job.batchNo}</td>
                        </tr>
                        <tr>
                            <th>Exp. Date</th>
                            <td>{formatDate(job.expiredDate)}</td>
                        </tr>
                        <tr>
                            <th>Mfg. Date</th>
                            <td>{formatDate(data.manufactureDate)}</td>
                        </tr>
                        <tr>
                            <th>HET</th>
                            <td>{250000}</td>
                        </tr>
                    </tbody>
                </table>
                <div className='qr-code'>
                    <QRCode value={data.id} size={128}/>
                    <p>{data.id}</p>
                </div>
            </div>
        );
    });
    return (
        <Modal width='40vw'>
            {dataToBePrinted}
            <button style={{marginBottom:"20px"}}onClick={toggleModal}>Close</button>
        </Modal>
    );
}