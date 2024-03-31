import './DataDemo.css';
import { useEffect, useState } from 'react';
import { OptionForm } from '../../Components/FormDetail/FormDetail';
import { Link } from 'react-router-dom';
import Barcode from 'react-jsbarcode';
import QRCode from 'react-qr-code';
import Modal from '../../Components/Modal/Modal';

export default function DataDemo({jobs, products, orders, masterboxs}){
    const masterboxIDs = masterboxs.map((masterbox) => `${masterbox.id}`);
    const [masterboxId, setMasterboxId] = useState('');
    const [masterboxData, setMasterboxData] = useState(null);
    const [orderData, setOrderData] = useState([]);
    const [jobData, setJobData] = useState([]);
    const [productData, setProductData] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const orderDisplay = orderData.map((data, index) => {
        return (
            <div key={index} className='order-border flex-space-between'>
                <table id='table'>
                    <tbody>
                        <tr>
                            <th>No. Batch</th>
                            <td>{jobData.batchNo}</td>
                        </tr>
                        <tr>
                            <th>Exp. Date</th>
                            <td>{formatDate(jobData.expiredDate)}</td>
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
                    <button className='qr-btn' onClick={()=>{setShowModal(true)}}><QRCode value={data.id} size={128}/></button>
                    <p>{data.id}</p>
                </div>
            </div>
        );
    });

    function formatDate(date) {
        if (!date) return "";
        if (date instanceof Date) {
            return date.toISOString().split('T')[0];
        } else {
            return new Date(date).toISOString().split('T')[0];
        }
    }

    useEffect(() => {
        if (masterboxId) {
            const masterbox = masterboxs.find((masterbox) => masterbox.id === masterboxId);
            setMasterboxData(masterbox);
            console.log("Masterbox : ", masterbox);

            const order = orders.filter((order) => order.masterboxID === masterboxId);
            setOrderData(order);
            console.log("Order : ", order);

            const job = jobs.find((job) => job.id === masterbox.jobID);
            setJobData(job);
            console.log("Job : ", job);

            const product = products.find((product) => product.id === job.productID);
            setProductData(product);
            console.log("Product : ", product);
        } else {
            setMasterboxData(null);
            setOrderData([]);
            setJobData([]);
            setProductData([]);
        }
    }, [masterboxId]);
    return (
        <>
            <Link to={"/"}>Back</Link>
            <div className='center'>
                <h1>Data Demo</h1>
                <OptionForm variableName='Masterbox' options={masterboxIDs} value={masterboxId} setValue={(e)=>{setMasterboxId(e)}}/>
                {masterboxData === null ? <></> : <MasterboxDisplay productData={productData} jobData={jobData} masterboxData={masterboxData}/>}
                {orderData.length === 0 ? <></> : 
                <><h1>Orders</h1>
                {orderDisplay}</>
                }
                {showModal && <ProductModal productData={productData} setShowModal={setShowModal}/>}
            </div>
           
        </>
    )
}

function MasterboxDisplay({productData, jobData, masterboxData}){
    return (
        <>
            <div className='masterbox'>
                <div className='masterbox-data'>
                    <h1>{productData.name}</h1>
                    <div className='flex-space-between'>
                        <div className='product-details'>
                            <table className='border-table'>
                                <tbody>
                                    <tr>
                                        <th>NIE</th>
                                        <td className='modal-data'>{productData.nie}</td>
                                    </tr>
                                    <tr>
                                        <th>Expired Date</th>
                                        <td className='modal-data'>{jobData.expiredDate}</td>
                                    </tr>
                                    <tr>
                                        <th>QTY per box</th>
                                        <td className='modal-data'>{productData.quantity}</td>
                                    </tr>
                                    <tr>
                                        <th>Storage</th>
                                        <td className='modal-data'>{productData.storage}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div>
                            <p style={{fontWeight:"bold"}}>Manufactured by :</p>
                            <p>PT Pharma Health Care Indonesia</p>
                        </div>
                    </div>
                    <div id='barcode'>
                        <p>Batch : {jobData.batchNo}</p>
                        <Barcode value={masterboxData.id} options={{ format: 'code128' }} renderer="svg"/>
                    </div>
                </div>
                
            </div>
        </>
    );
}

function ProductModal({productData, setShowModal}) {
    return (
        <>
            <Modal>
                <h1>{productData.name}</h1>
                <p>Product ID: {productData.id}</p>
                <p>NIE : {productData.nie}</p>
                <p>HET : {productData.het}</p>
                <p>Quantity per box : {productData.quantity}</p>
                <p>Storage : {productData.storage}</p>
                <button onClick={()=>{setShowModal(false)}}>Close</button>
            </Modal>
            
        </>
    );
}