import './Agregasi.css';
import ActionButton from '../../Components/ActionButton/ActionButton';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {EndModal, JobList, JobModal} from '../Serialisasi/Serialisasi';
import ReactTable from '../../Components/Table/ReactTable';
import Modal from '../../Components/Modal/Modal';
import Barcode from 'react-jsbarcode';
import { OptionForm } from '../../Components/FormDetail/FormDetail';

export default function Agregasi({jobs, setJobs, products, globalOrders, setGlobalOrders, globalMasterboxs, setGlobalMasterbox}){
    const headers = ['No', 'Order ID', 'Masterbox ID', 'Manufacture Date', 'Status'];
    const [showJobModal, setShowJobModal] = useState(false);
    const [showEndModal, setShowEndModal] = useState(false);
    const [showPrintModal, setShowPrintModal] = useState(false);

    const [aggregationQty, setAggregationQty] = useState(0);
    const [aggregationLvl, setAggregationLvl] = useState('');
    const [currentJob, setCurrentJob] = useState({});
    const [scannedData, setScannedData] = useState([]);
    const [printData, setPrintData] = useState(null);
    const [product, setProduct] = useState(null);

    useEffect(() => {
        if (product !== null) {
            const aggregation = product.aggregations.find((aggregation) => aggregation.name === aggregationLvl);
            setAggregationQty(aggregation.quantity);
        } 
    }, [aggregationLvl])

    useEffect(() => {
        if (currentJob !== null) {
            if (aggregationQty > 0 && scannedData.length >= aggregationQty) {
                printMasterBox();
            }
        }
    }, [scannedData])

    const getProductAggregationNames = (product) => {
        if (product.aggregations === undefined) return [];
        return product.aggregations.map((aggregation) => aggregation.name);
    }
    
    const loadJob = (index) => {
        const job = jobs[index];
        const product = products.find((product) => product.id === job.productID);
        setProduct(product);
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
        const aggregation = product.aggregations.find((aggregation) => aggregation.name === aggregationLvl);
        if (aggregation.level === 1) {
            const orders = globalOrders.filter((order) => order.jobID === currentJob.id && order.masterboxID === "");
            if (orders === undefined || orders.length === 0) return;
            const index = scannedData.length;
            const order = orders[index];
            const newData = {
                orderID : order.id,
                masterboxID : order.masterboxID,
                printDate : order.printDate,
                orderStatus : order.status
            };
            setScannedData([...scannedData, newData]);
        } else {
            const masterboxPrefix = aggregation.prefix;
            const masterboxs = globalMasterboxs.filter((masterbox)=> masterbox.jobID === currentJob.id && !masterbox.id.includes(masterboxPrefix) &&masterbox.masterboxID === undefined);
            if (masterboxs === undefined || masterboxs.length === 0) return;
            const index = scannedData.length;
            if (masterboxs[index] == null) return;
            const masterbox = masterboxs[index];
            const newData = {
                orderID : masterbox.id,
                masterboxID : masterbox.masterboxID || '',
                manufactureDate : new Date().toString(),
                orderStatus : masterbox.status
            };
            setScannedData([...scannedData, newData]);
        }
    }

    const printMasterBox = () => {
        const productAggregation = product.aggregations.find((aggregation) => aggregation.name === aggregationLvl);
        const masterboxPrefix = productAggregation.prefix;
        const existingDataLength = globalMasterboxs.filter((masterbox) => masterbox.id.includes(masterboxPrefix)).length + 1;
        const generatedID = `${product.nie}/${currentJob.batchNo}/${masterboxPrefix}${(existingDataLength).toString().padStart(3, "0")}`;
        const masterbox = {
            id : generatedID,
            productID : currentJob.productID,
            jobID : currentJob.id,
            printDate : new Date().toLocaleDateString(),
        }
        const printData = {
            id : generatedID,
            productName : product.name,
            nie : product.nie,
            expiredDate : formatDate(currentJob.expiredDate),
            quantity : scannedData.length,
            storage : product.storage,
            manufacturer : "PT Samco Indonesia",
            batchNo : currentJob.batchNo,
        };
        const aggregation = product.aggregations.find((aggregation) => aggregation.name === aggregationLvl);
        if (aggregation.level === 1) {
            let globalArrayOrders = [...globalOrders];
            const updatedOrders = globalArrayOrders.map((order) => {
                if (scannedData.find((data) => data.orderID === order.id)){
                    order.masterboxID = generatedID;
                    order.status = "Scanned";
                }
                return order;
            });
            setGlobalOrders(updatedOrders);
        } else {
            let globalArrayMasterboxs = [...globalMasterboxs];
            const updatedMasterboxs = globalArrayMasterboxs.map((masterbox) => {
                if (scannedData.find((data) => data.orderID === masterbox.id)){
                    masterbox.masterboxID = generatedID;
                    masterbox.status = "Scanned";
                }
                return masterbox;
            });
            setGlobalMasterbox(updatedMasterboxs);
        }
        setScannedData([]);
        setGlobalMasterbox([...globalMasterboxs, masterbox]);
        setPrintData(printData);
        toggleModal("PrintModal");
    }

    return (
        <>
            <Link to='/'>Back</Link>
            <h1 className='title'>Agregasi</h1>
            {showJobModal && <JobModal toggleModal={()=>toggleModal("JobModal")} loadJob={loadJob} jobs={jobs.filter((job) => job.jobStatus === "Serialized")}/>}
            {showEndModal && <EndModal toggleModal={()=>toggleModal("EndModal")} endJob={endJob}/>}
            {showPrintModal && <PrintModal data={printData} toggleModal={()=>endPrint()}/>}
            <div className='flex-row job-display'>
                <div className='col'>
                    {product !== null && <OptionForm variableName={"Level"} options={getProductAggregationNames(product)} value={aggregationLvl} setValue={setAggregationLvl}/>}
                    
                    <JobList name={"Job ID"} detail={currentJob.id} />
                    <JobList name={"Produk"} detail={currentJob.productID} />
                    <JobList name={"Batch No"} detail={currentJob.batchNo} />
                </div>
                <div className='col'>
                    <JobList name={"Order Quantity"} detail={aggregationQty}/>
                    <JobList name={"Expired Date"} detail={formatDate(currentJob.expiredDate)}/>
                    <JobList name={"Job Status"} detail={currentJob.jobStatus}/>
                </div>
                <div className='flex-column'>
                    <ActionButton name={"Load Job"} onClickFunction={()=>{toggleModal("JobModal")}}/>
                    <ActionButton name={"End Job"} onClickFunction={()=> {toggleModal("EndModal")}} disabled={Object.keys(currentJob).length === 0}/>
                </div>
                <div className='flex-column'>
                    <ActionButton name={"Print"} onClickFunction={()=> {printMasterBox()}} disabled={scannedData.length <= 0||Object.keys(currentJob).length === 0}/>
                    <ActionButton name={"Scan"} onClickFunction={()=> {scanOrder()}} disabled={Object.keys(currentJob).length === 0 || scannedData.length >= aggregationQty}/>
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
        <Modal width='45vw'>
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
                <Barcode value={data.id} options={{ format: 'code128' }} renderer="svg"/>
            </div>
            <ActionButton id='printBtn' name={"Print"} onClickFunction={()=>{toggleModal()}}/>
        </Modal>
    );
}