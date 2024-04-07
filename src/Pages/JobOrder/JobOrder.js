import { FormDetail, DateForm, OptionForm, NumberForm } from '../../Components/FormDetail/FormDetail';
import './JobOrder.css';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ActionButton from '../../Components/ActionButton/ActionButton';
import ReactTable from '../../Components/Table/ReactTable';

export default function JobOrder({jobs, setJobs, products}) {
    const [productID, setProductID] = useState('');
    const [batchNo, setBatchNo] = useState('');
    const [expiredDate, setDate] = useState('');
    const [topQuantity, setTopQuantity] = useState(0);
    const [quantity, setQuantity] = useState('');
    const [jobStatus, setJobStatus] = useState('Active');
    const productsID = products.map((product) => `${product.id}`);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(null);

    const header = ["No", "ID Job", "ID Produk", "Batch No", "Expired Date", "Top Aggregation Quantity", "Order Quantity", "Job Status"];

    useEffect(() => {
        if (productID !== null) {
            const selectedProduct = products.find((product) => product.id === productID);
            if (selectedProduct) {
                setCurrentProduct(selectedProduct);
            }
        }
    }, [productID, products]);

    useEffect(() => {
        if (currentProduct) {
            const aggregations = currentProduct.aggregations.sort((a, b) => b.level - a.level);
            if (aggregations.length > 0) {
                const multipliedQuantity = aggregations.reduce((acc, curr) => acc * curr.quantity, topQuantity);
                setQuantity(multipliedQuantity);
            }
        }
    }, [topQuantity, currentProduct]);

    function validateData(){
        return productID === "" || batchNo === "" || expiredDate === "" || quantity === "" || jobStatus === "";
    }

    function onClickRow(index){
        setCurrentIndex(index);
        
        const selectedData = jobs[index];
        setFormData(selectedData);
    }

    function saveData() {
        if (currentIndex !== null) {
            const updatedData = {
                id: jobs[currentIndex].id,
                productID: productID,
                batchNo: batchNo,
                expiredDate: expiredDate,
                topAggregationQty : topQuantity,
                productQty: quantity,
                jobStatus: jobStatus,
              };
              const newData = [...jobs.slice(0, currentIndex), updatedData, ...jobs.slice(currentIndex + 1)];
              setJobs(newData);
        } else {
            const existingDataLength = jobs.length;
            const generatedID = `J${(existingDataLength+1).toString().padStart(3, "0")}`;
            const newData = {
                id : generatedID,
                productID : productID,
                batchNo : batchNo,
                expiredDate : expiredDate,
                topAggregationQty : topQuantity,
                productQty: quantity,
                jobStatus : jobStatus
            };
            setJobs([...jobs, newData]);
        }
    }

    function deleteData(){
        const newData = [...jobs.slice(0, currentIndex), ...jobs.slice(currentIndex+1)];
        setJobs(newData);
        setCurrentIndex(null);
        clearData();
    }

    function clearData(){
        setProductID('');
        setBatchNo('');
        setDate('');
        setTopQuantity(0);
        setQuantity(0);
        setJobStatus('');
        setCurrentIndex(null);
    }
    
    function setFormData(data){
        setProductID(data.productID);
        setBatchNo(data.batchNo);
        setDate(data.expiredDate);
        setQuantity(data.quantity);
        setJobStatus(data.jobStatus);
        setTopQuantity(data.topAggregationQty);
    }

    return (
        <>
            <Link to="/">Back</Link>
            <h1 className='title'>Job Order</h1>
            <div className='flex-row'>
                <form id='form'>
                    <OptionForm variableName='Produk' options={productsID} value={productID} setValue={(e)=>{setProductID(e)}}/>
                    <FormDetail variableName='Batch No' value={batchNo} setValue={(e)=>{setBatchNo(e)}}/>
                    <DateForm variableName='Expired Date' value={expiredDate} setValue={(e)=>{setDate(e)}}/>
                    <NumberForm variableName='Top Aggregation Qty' value={topQuantity} setValue={setTopQuantity}/>
                    <NumberForm variableName='Product Qty' value={quantity} setValue={setQuantity}/>
                    <OptionForm variableName='Job Status' options={['Active', 'Cancel', 'Suspended']} value={jobStatus} setValue={(e)=>{setJobStatus(e)}}/>
                </form>
                <div style={{marginLeft: '10vw'}}>
                    {currentProduct !== null && 
                    <>
                        <div style={{fontWeight: 'bold'}}>Product Quantity Estimation : </div>
                        <div>{quantity} Products</div>
                        {currentProduct.aggregations
                            .sort((a, b) => a.level - b.level)
                            .map((aggregation, index) => {
                                let estimatedQuantity = 0;
                                if (aggregation.level > 1 ) {
                                    const previousQuantity = currentProduct.aggregations.slice(0, index).reduce((acc, curr) => acc / curr.quantity, quantity);
                                    estimatedQuantity = previousQuantity / aggregation.quantity;
                                } else {
                                    estimatedQuantity = quantity / aggregation.quantity;
                                }
                                return (
                                    <div key={index}>
                                        <div style={{fontWeight: 'bold'}}>Level {aggregation.level} : {aggregation.name}</div>
                                        <div>Capacity : {aggregation.quantity}</div>
                                        <div>Quantity : {estimatedQuantity}</div>
                                    </div>
                                );
                            })}
                    </>
                    }
                </div>
            </div>
            <div id='buttonRow'>
                <ActionButton name={"Delete"} color='#ffa2a2' onClickFunction={deleteData} disabled={currentIndex === null}/>
                <div>
                    <ActionButton name={"Clear"} color='#fdff9b' onClickFunction={clearData}/>
                    <ActionButton name={"Save"} color='#b5f9b8' onClickFunction={saveData} disabled={validateData()}/>
                </div>
            </div>

            <div id='table'>
                <ReactTable headers={header} datas={jobs} currentIndex={null} onClickHandler={onClickRow}/>
            </div>
        </>
    );
}