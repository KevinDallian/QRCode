import './Serialisasi.css';
import { Link } from 'react-router-dom';
import ActionButton from '../../Components/ActionButton/ActionButton';
import ReactTable from '../../Components/Table/ReactTable';
import { useState } from 'react';
import Modal from '../../Components/Modal/Modal';
import QRCode from 'react-qr-code';
import JobApi from '../../Services/JobAPI';
import OrderApi from '../../Services/OrderAPI';
import ProductApi from '../../Services/ProductAPI';
import Job from '../../Models/Job';
import Order from '../../Models/Order';

export default function Serialisasi({globalOrders, setGlobalOrders}){
    const headers = ['No', 'Order ID', 'Job ID', 'Masterbox ID', 'Manufacture Date', 'Status'];
    const [showJobModal, setShowJobModal] = useState(false);
    const [showEndModal, setShowEndModal] = useState(false);
    const [currentJob, setCurrentJob] = useState({});
    const [showPrintModal, setShowPrintModal] = useState(false);
    const [orders, setOrders] = useState([]);
    const [ordersDisplay, setOrdersDisplay] = useState([]);
    const jobApi = JobApi();
    const productApi = ProductApi();
    const orderApi = OrderApi();

    const loadJob = (index) => {
        const job = jobApi.jobsData[index];
        const updatedJob = new Job(job.job_id, job.product_id, job.batch_no, job.expired_date, job.top_order_qty, job.bottom_order_qty , job.status, job.date_created);
        const product = productApi.productData.find((product) => product.product_id === updatedJob.productID);
        setCurrentJob(updatedJob);
        if (orderApi.ordersData.some((order) => order.jobID === updatedJob.id)) {
            const orders = globalOrders.filter((order) => order.jobID === updatedJob.id);
            setOrders(orders);
        } else {
            generateData(updatedJob, product);
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
        const updatedJob = currentJob;
        updatedJob.jobStatus = "Printed";
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

    const printData = () => {
        const ordersTobePrinted = orders.map((order) => {
            order.status = "Printed";
            order.printDate = new Date().toLocaleDateString();
            return order;
        });
        setOrders(ordersTobePrinted);
        setOrdersDisplay(ordersTobePrinted.map((data, index) => {
            return {
                id : data.id,
                jobID : data.jobID,
                masterboxID : data.masterboxID,
                manufactureDate : data.manufactureDate,
                status : data.status,
            }
        }));
        const globalOrdersUpdated = globalOrders.map((globalOrder) => {
            const order = ordersTobePrinted.find((order) => order.id === globalOrder.id);
            if (order) {
                return order;
            } else {
                return globalOrder;
            }
        });
        setGlobalOrders(globalOrdersUpdated);
        toggleModal("PrintModal");
    }

    const generateData = (job, product) => {
        const generatedData = Array.from({ length: job.orderQuantity }, (_, index) => {
            const generatedID = `(90)${product.nie}(91)${formatDate(job.expiredDate)}(00)${job.batchNo}(01)${(index + 1).toString().padStart(3, "0")}`;
            return new Order(generatedID, job.id, product.product_id, null, null, "Not Printed");
        });
        
        const handleSuccess = (datas) => {
            setOrders(datas);
            setOrdersDisplay(datas.map((data) => {
                return {
                    id : data.id,
                    jobID : data.jobID,
                    masterboxID : data.masterboxID,
                    manufactureDate : data.manufactureDate,
                    status : data.status,
                }    
            }));
        }
        orderApi.insertOrders(generatedData, handleSuccess);
        setGlobalOrders([...globalOrders, ...generatedData]);
    }

    return (
        <>
            {showJobModal && <JobModal toggleModal={()=>toggleModal("JobModal")} loadJob={loadJob} jobs={jobApi.jobsData.filter((job) => job.status === "Active")}/>}
            <Link to='/'>Back</Link>
            {showEndModal && <EndModal toggleModal={()=>toggleModal("EndModal")} endJob={endJob}/>}
            {showPrintModal && <PrintModal data={orders} toggleModal={()=>endPrint()} job={currentJob} product={productApi.productData.find((product) => product.id === currentJob.productID)}/>}
            <h1 className='title'>Serialisasi</h1>
            <div className='flex-row job-display'>
                <div className='col'>
                    <JobList name={"Job ID"} detail={currentJob.id}/>
                    <JobList name={"Produk"} detail={currentJob.productID}/>
                    <JobList name={"Batch No"} detail={currentJob.batchNo} />
                </div>
                <div className='col'>
                    <JobList name={"Order Quantity"} detail={currentJob.orderQuantity}/>
                    <JobList name={"Expired Date"} detail={formatDate(currentJob.expiredDate)}/>
                    <JobList name={"Job Status"} detail={currentJob.jobStatus}/>
                </div>
                <div className='flex-column'>
                    <ActionButton name={"Load Job"} onClickFunction={()=>{toggleModal("JobModal")}}/>
                    <ActionButton name={"End Job"} onClickFunction={()=> {toggleModal("EndModal")}} disabled={Object.keys(currentJob).length === 0}/>
                </div>
                <div className='flex-column'>
                    <ActionButton name={"Print"} onClickFunction={printData}/>
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
                <ReactTable headers={headers} datas={ordersDisplay} onClickHandler={(e)=>{console.log(e)}}/>
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
    const jobDisplay = jobs.map((job) => {
        return {
            id : job.job_id,
            productID : job.product_id,
            batchNo : job.batch_no,
            expiredDate : job.expired_date,
            topAggregationQty : job.top_order_qty,
            productQty: job.bottom_order_qty,
            jobStatus : job.status,
        }
    });

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
                <ReactTable headers={modalHeaders} datas={jobDisplay} currentIndex={currentIndex} onClickHandler={onClickTableModal}/>
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

function PrintModal({data, toggleModal, job, product}) {
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
                            <td>{product.het}</td>
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