import './Serialisasi.css';
import { Link } from 'react-router-dom';
import ActionButton from '../../Components/ActionButton/ActionButton';
import ReactTable from '../../Components/Table/ReactTable';

export default function Serialisasi(){
    const headers = ['No', 'Order ID', 'Status'];
    const data = [];
    return (
        <>
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
                    <ActionButton name={"Load Job"} onClickFunction={()=> {console.log("Load Job")}}/>
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