import './Serialisasi.css';
import { Link } from 'react-router-dom';
import ActionButton from '../../Components/ActionButton/ActionButton';
import ReactTable from '../../Components/Table/ReactTable';
import { useState } from 'react';

export default function Serialisasi(){
    const headers = ['No', 'Order ID', 'Status'];
    const [showModal, setShowModal] = useState(false);
    const [currentJob, setCurrentJob] = useState({});
    const [data, setData] = useState([]);

    const toggleModal = () => {
        setShowModal(!showModal);
    }

    return (
        <>
            {showModal && <JobModal showModal={showModal} setShowModal={setShowModal}/>}
            <Link to='/'>Back</Link>
            <h1 className='title'>Serialisasi</h1>
            <div className='flex-row job-display'>
                <div className='col'>
                    <JobList name={"Job ID"} detail={"J001"}/>
                    <JobList name={"Produk"} detail={"DKL201030123"}/>
                    <JobList name={"Batch No"} detail={"202423/01"} />
                </div>
                <div className='col'>
                    <JobList name={"Order Quantity"} detail={""}/>
                    <JobList name={"Expired Date"} detail={""}/>
                    <JobList name={"Job Status"} detail={"Active"}/>
                </div>
                <div className='flex-column'>
                    <ActionButton name={"Load Job"} onClickFunction={toggleModal}/>
                    <ActionButton name={"End Job"} onClickFunction={()=> {console.log("End Job")}}/>
                </div>
                <div className='flex-column'>
                    <ActionButton name={"Print"} onClickFunction={()=> {console.log("Print")}}/>
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
            <div id='table'>
                <ReactTable headers={headers} datas={data}/>
            </div>
        </>
    );
}

function JobList({name, detail}) {
    return (
        <div className='flex-space-between'>
            <h3 className='name'>{name}</h3>
            <h3 className='detail'>{detail}</h3>
        </div>
    );
}

function JobModal({showModal, setShowModal, currentJob, setCurrentJob}) {
    const [currentIndex, setCurrentIndex] = useState(null);
    const modalHeaders = ["ID Job", "ID Produk", "Batch No", "Expired Date", "Order Quantity", "Job Status"];
    const jobs = [
        {id : "J001", productID : "PR001", batchNo : "23032024/01", expiredDate : new Date("2024-03-29").toString(), quantity : 100, jobStatus : "Active"},
    ];
    
    const toggleModal = () => {
        setShowModal(!showModal);
    }

    const loadJob = (job) => {
        setCurrentJob(job);
        toggleModal();
    }

    return (
        <div className='modal'>
            <div className='modal-content'>
                <div className='flex-space-between'>
                    <h1>Load Job</h1>
                    <div className='flex-column'>
                        <button className='modal-btn' onClick={loadJob}>Load</button>
                        <button className='modal-btn' onClick={toggleModal}>Cancel</button>
                    </div>
                </div>
                <div className=''>
                    <ReactTable headers={modalHeaders} datas={jobs} onClickHandler={(e)=>{setCurrentIndex(e.target.value)}}/>
                </div>
            </div>
        </div>
    );
}