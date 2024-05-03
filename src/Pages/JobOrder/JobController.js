import { useState, useEffect } from 'react';
import JobAPI from '../../Services/JobAPI';
import ProductAPI from '../../Services/ProductAPI';
import Job from '../../Models/Job';
import Product from '../../Models/Product';

function JobController() {
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

    return {
        productID, setProductID,
        batchNo, setBatchNo,
        expiredDate, setDate,
        topQuantity, setTopQuantity,
        quantity, setQuantity,
        jobStatus, setJobStatus,
        jobs, setJobs,
        currentProduct, setCurrentProduct,
        currentIndex, setCurrentIndex,
        jobDisplay, setJobDisplay,
        productsID, setProductsID,
        header,
        validateData,
        onClickRow,
        saveData,
        deleteData,
        clearData,
        setFormData
    }
}

export default JobController;