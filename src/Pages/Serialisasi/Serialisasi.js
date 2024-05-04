import './Serialisasi.css';
import { Link } from 'react-router-dom';
import ActionButton from '../../Components/ActionButton/ActionButton';
import ReactTable from '../../Components/Table/ReactTable';
import { useState } from 'react';
import Modal from '../../Components/Modal/Modal';
import QRCode from 'react-qr-code';
import SerialisasiController from './SerialisasiController';

export default function Serialisasi() {
    const controller = SerialisasiController();

    return (
        <>
            {controller.showJobModal && <JobModal toggleModal={() => controller.toggleModal("JobModal")} loadJob={controller.loadJob} jobs={controller.jobApi.jobsData} />}
            <Link to='/'>Back</Link>
            {controller.showEndModal && <EndModal toggleModal={() => controller.toggleModal("EndModal")} endJob={controller.endJob} />}
            {controller.showPrintModal && <PrintModal data={controller.orders} toggleModal={() => controller.endPrint()} job={controller.currentJob} product={controller.productApi.productData.find((product) => product.id === controller.currentJob.productID)} />}
            <h1 className='title'>Serialisasi</h1>
            <div className='flex-row job-display'>
                <div className='col'>
                    <JobList name={"Job ID"} detail={controller.currentJob.id} />
                    <JobList name={"Produk"} detail={controller.currentJob.productID} />
                    <JobList name={"Batch No"} detail={controller.currentJob.batchNo} />
                </div>
                <div className='col'>
                    <JobList name={"Order Quantity"} detail={controller.currentJob.orderQuantity} />
                    <JobList name={"Expired Date"} detail={controller.formatDate(controller.currentJob.expiredDate)} />
                    <JobList name={"Job Status"} detail={controller.currentJob.jobStatus} />
                </div>
                <div className='flex-column'>
                    <ActionButton name={"Load Job"} onClickFunction={() => { controller.toggleModal("JobModal") }} />
                    <ActionButton name={"End Job"} onClickFunction={() => { controller.toggleModal("EndModal") }} disabled={Object.keys(controller.currentJob).length === 0} />
                </div>
                <div className='flex-column'>
                    <ActionButton name={"Print"} onClickFunction={controller.printData} />
                    <ActionButton name={"Test Print"} onClickFunction={() => { console.log("Test Print") }} />
                    <ActionButton name={"Stop Print"} onClickFunction={() => { console.log("Stop Print") }} />
                </div>
            </div>
            <div className='print-status'>
                <p>Quantity Scanned :</p>
                <p>Success          :</p>
                <p>Skipped          :</p>
                <p>Cancelled        :</p>
            </div>
            <div id='table-serialisasi'>
                <ReactTable headers={controller.headers} datas={controller.ordersDisplay} onClickHandler={(e) => { console.log(e) }} />
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