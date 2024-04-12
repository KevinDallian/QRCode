import './Reporting.css';
import { useEffect, useState } from 'react';
import { OptionForm } from '../../Components/FormDetail/FormDetail';
import { Link } from 'react-router-dom';
import { DateForm } from '../../Components/FormDetail/FormDetail';
import Barcode from 'react-jsbarcode';
import QRCode from 'react-qr-code';
import Modal from '../../Components/Modal/Modal';

export default function Reporting({jobs, products, orders, masterboxs}){
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
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
    return (
        <>
            <Link to={"/"}>Back</Link>
            <div className='center'>
                <h1>Reporting</h1>
                <DateForm variableName='Start Date' value={startDate} setValue={setStartDate}/>
                <DateForm variableName='End Date' value={endDate} setValue={setEndDate}/>
                {showModal && <ProductModal productData={productData} setShowModal={setShowModal}/>}
                <button onClick={()=>{console.log('Generate')}}>Generate</button>
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