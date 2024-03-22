import { FormDetail, DateForm, OptionForm } from '../../Components/FormDetail/FormDetail';
import './JobOrder.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function JobOrder() {
    const [date, setDate] = useState('');
    const [jobType, setJobType] = useState('');
    const [batchNo, setBatchNo] = useState('');
    const [quantity, setQuantity] = useState('');
    const [jobStatus, setJobStatus] = useState('');

    return (
        <>
            <Link to="/">Back</Link>
            <h1 className='title'>Job Order</h1>
            <form id='form'>
                <OptionForm variableName='Job Type' options={['Type 1', 'Type 2', 'Type 3']} value={jobType} setValue={(e)=>{setJobType(e)}}/>
                <FormDetail variableName='Batch No' value={batchNo} setValue={(e)=>{setBatchNo(e)}}/>
                <DateForm variableName='Expired Date' value={date} setValue={(e)=>{setDate(e)}}/>
                <FormDetail variableName='Order Qty' value={quantity} setValue={(e)=>{setQuantity(e)}}/>
                <OptionForm variableName='Job Status' options={['Active', 'Cancel', 'Suspended']} value={jobStatus} setValue={(e)=>{setJobStatus(e)}}/>
            </form>
        </>
    );
}