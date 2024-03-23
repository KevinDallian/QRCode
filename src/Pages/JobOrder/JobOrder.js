import { FormDetail, DateForm, OptionForm } from '../../Components/FormDetail/FormDetail';
import './JobOrder.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import ActionButton from '../../Components/ActionButton/ActionButton';
import ReactTable from '../../Components/Table/ReactTable';

export default function JobOrder() {
    const [productID, setProductID] = useState('PR001');
    const [batchNo, setBatchNo] = useState('');
    const [expiredDate, setDate] = useState('');
    const [quantity, setQuantity] = useState('');
    const [jobStatus, setJobStatus] = useState('Active');

    const [currentIndex, setCurrentIndex] = useState(null);

    const header = ["ID Job", "ID Produk", "Batch No", "Expired Date", "Order Quantity", "Job Status"];

    const [data, setData] = useState([
        {id : "J001", productID : "PR001", batchNo : "23032024/01", expiredDate : new Date("2024-03-29").toString(), quantity : 100, jobStatus : "Active"},
    ]);

    function validateData(){
        return productID === "" || batchNo === "" || expiredDate === "" || quantity === "" || jobStatus === "";
    }

    function onClickRow(index){
        setCurrentIndex(index);
        
        const selectedData = data[index];
        setFormData(selectedData);
    }

    function saveData() {
        if (currentIndex !== null) {
            const updatedData = {
                id: data[currentIndex].id,
                productID: productID,
                batchNo: batchNo,
                expiredDate: expiredDate,
                quantity: quantity,
                jobStatus: jobStatus,
              };
              const newData = [...data.slice(0, currentIndex), updatedData, ...data.slice(currentIndex + 1)];
              setData(newData);
        } else {
            const existingDataLength = data.length;
            const generatedID = `J${(existingDataLength+1).toString().padStart(3, "0")}`;
            const newData = {
                id : generatedID,
                productID : productID,
                batchNo : batchNo,
                expiredDate : expiredDate,
                quantity : quantity,
                jobStatus : jobStatus
            };
            setData([...data, newData]);
        }
    }

    function deleteData(){
        const newData = [...data.slice(0, currentIndex), ...data.slice(currentIndex+1)];
        setData(newData);
        setCurrentIndex(null);
    }

    function clearData(){
        setProductID('');
        setBatchNo('');
        setDate('');
        setQuantity('');
        setJobStatus('');
        setCurrentIndex(null);
    }
    
    function setFormData(data){
        setProductID(data.productID);
        setBatchNo(data.batchNo);
        setDate(data.expiredDate);
        setQuantity(data.quantity);
        setJobStatus(data.jobStatus);
    }

    return (
        <>
            <Link to="/">Back</Link>
            <h1 className='title'>Job Order</h1>
            <div>
                <form id='form'>
                    <OptionForm variableName='Produk' options={['PR001', 'PR002']} value={productID} setValue={(e)=>{setProductID(e)}}/>
                    <FormDetail variableName='Batch No' value={batchNo} setValue={(e)=>{setBatchNo(e)}}/>
                    <DateForm variableName='Expired Date' value={expiredDate} setValue={(e)=>{setDate(e)}}/>
                    <FormDetail variableName='Order Qty' value={quantity} setValue={(e)=>{setQuantity(e)}}/>
                    <OptionForm variableName='Job Status' options={['Active', 'Cancel', 'Suspended']} value={jobStatus} setValue={(e)=>{setJobStatus(e)}}/>
                </form>
            </div>
            

            <div id='buttonRow'>
                <ActionButton name={"Delete"} color='#ffa2a2' onClickFunction={deleteData} disabled={currentIndex === null}/>
                <div>
                    <ActionButton name={"Clear"} color='#fdff9b' onClickFunction={clearData}/>
                    <ActionButton name={"Save"} color='#b5f9b8' onClickFunction={saveData} disabled={validateData()}/>
                </div>
            </div>

            <div id='table'>
                <ReactTable headers={header} datas={data} currentIndex={null} onClickHandler={onClickRow}/>
            </div>
            
        </>
    );
}