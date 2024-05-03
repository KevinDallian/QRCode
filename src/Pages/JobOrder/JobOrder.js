import { FormDetail, DateForm, OptionForm, NumberForm } from '../../Components/FormDetail/FormDetail';
import './JobOrder.css';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ActionButton from '../../Components/ActionButton/ActionButton';
import ReactTable from '../../Components/Table/ReactTable';
import JobAPI from '../../Services/JobAPI';
import Job from '../../Models/Job';
import Product from '../../Models/Product';
import ProductAPI from '../../Services/ProductAPI';

export default function JobOrder({}) {
    const [productID, setProductID] = useState('');
    const [batchNo, setBatchNo] = useState('');
    const [expiredDate, setDate] = useState('');
    const [topQuantity, setTopQuantity] = useState(0);
    const [quantity, setQuantity] = useState('');
    const [jobStatus, setJobStatus] = useState('Active');

    const [jobs, setJobs] = useState(null);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(null);
    const [jobDisplay, setJobDisplay] = useState([]);

    const jobAPI = JobAPI();
    const productAPI = ProductAPI();
    const [productsID, setProductsID] = useState([]);

    const header = ["No", "ID Job", "ID Produk", "Batch No", "Expired Date", "Top Aggregation Quantity", "Order Quantity", "Job Status"];

    useEffect(() => {
        const jobsData = jobAPI.jobsData;
        if (jobsData) {
            const updatedJobs = jobsData.map((job) => {
                return new Job(job.job_id, job.product_id, job.batch_no, job.expired_date, job.top_order_qty, job.bottom_order_qty, job.status, job.date_created)
            });
            setJobs(updatedJobs);
            setJobDisplay(updatedJobs.map((job) => {
                return {
                    id : job.id,
                    productID : job.productID,
                    batchNo : job.batchNo,
                    expiredDate : job.expiredDate,
                    topAggregationQty : job.topQuantity,
                    productQty: job.orderQuantity,
                    jobStatus : job.jobStatus,
                }        
            }));
        }
    }, [jobAPI.jobsData]);

    useEffect(() => {
        const productData = productAPI.productData;
        if (productData) {
            const updatedProducts = productData.map((product) => {
                return new Product(product.product_id, product.name, product.nie, product.het, product.storage_condition, product.aggregations);
            });
            const productsID = updatedProducts.map((product) => product.id);
            setProductsID(productsID);
        }
    }, [productAPI.productData]);

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
                jobStatus : jobStatus,
                dateCreated : new Date().toLocaleDateString(),
            };
            const displayData = {
                id : generatedID,
                productID : productID,
                batchNo : batchNo,
                expiredDate : expiredDate,
                topAggregationQty : topQuantity,
                productQty: quantity,
                jobStatus : jobStatus,
            };
            
            setJobs([...jobs, newData]);
            setJobDisplay([...jobDisplay, displayData]);
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
                        <div>{quantity} Produk</div>
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
                                    <div style={{marginTop:"5px"}}key={index}>
                                        <div style={{fontWeight: 'bold'}}>Level {aggregation.level} : {aggregation.name}</div>
                                        <div>Kapasitas : {aggregation.quantity}</div>
                                        <div>Kuantitas : {estimatedQuantity} {aggregation.name}</div>
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
                <ReactTable headers={header} datas={jobDisplay} currentIndex={null} onClickHandler={onClickRow}/>
            </div>
        </>
    );
}