import './Agregasi.css';
import ActionButton from '../../Components/ActionButton/ActionButton';
import { Link } from 'react-router-dom';
import {EndModal, JobList, JobModal} from '../Serialisasi/Serialisasi';
import ReactTable from '../../Components/Table/ReactTable';
import Modal from '../../Components/Modal/Modal';
import Barcode from 'react-jsbarcode';
import { OptionForm } from '../../Components/FormDetail/FormDetail';
import AgregasiController from './AggregasiController';

export default function Agregasi({jobs, products}){
    const controller = AgregasiController();

    return (
        <>
            <Link to='/'>Back</Link>
            <h1 className='title'>Agregasi</h1>
            {controller.showJobModal && <JobModal toggleModal={() => controller.toggleModal("JobModal")} loadJob={index => controller.loadJob(index, jobs, products)} jobs={jobs.filter((job) => job.jobStatus === "Serialized")} />}
            {controller.showEndModal && <EndModal toggleModal={() => controller.toggleModal("EndModal")} endJob={controller.endJob} />}
            {controller.showPrintModal && <PrintModal data={controller.printData} toggleModal={() => controller.endPrint()} />}
            <div className='flex-row job-display'>
                <div className='col'>
                    {controller.product !== null && <OptionForm variableName={"Level"} options={controller.getProductAggregationNames()} value={controller.aggregationLvl} setValue={controller.setAggregationLvl} />}
                    <JobList name={"Job ID"} detail={controller.currentJob.id} />
                    <JobList name={"Produk"} detail={controller.currentJob.productID} />
                    <JobList name={"Batch No"} detail={controller.currentJob.batchNo} />
                </div>
                <div className='col'>
                    <JobList name={"Order Quantity"} detail={controller.aggregationQty} />
                    <JobList name={"Expired Date"} detail={controller.formatDate()} />
                    <JobList name={"Job Status"} detail={controller.currentJob.jobStatus} />
                </div>
                <div className='flex-column'>
                    <ActionButton name={"Load Job"} onClickFunction={() => controller.toggleModal("JobModal")} />
                    <ActionButton name={"End Job"} onClickFunction={() => controller.toggleModal("EndModal")} disabled={Object.keys(controller.currentJob).length === 0} />
                </div>
                <div className='flex-column'>
                    <ActionButton name={"Print"} onClickFunction={() => controller.printMasterBox()} disabled={controller.scannedData.length <= 0 || Object.keys(controller.currentJob).length === 0} />
                    <ActionButton name={"Scan"} onClickFunction={() => controller.scanOrder()} disabled={Object.keys(controller.currentJob).length === 0 || controller.scannedData.length >= controller.aggregationQty} />
                </div>
            </div>

            <div id='table'>
                <ReactTable headers={controller.headers} datas={controller.scannedData} onClickHandler={(e) => { console.log(e) }} />
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