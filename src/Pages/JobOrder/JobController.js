import { useState, useEffect } from 'react';
import JobAPI from '../../Services/JobAPI';
import ProductAPI from '../../Services/ProductAPI';
import AggregationAPI from '../../Services/AggregationAPI';
import Job from '../../Models/Job';
import Product from '../../Models/Product';
import Aggregation from '../../Models/Aggregations'

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

    const productAPI = ProductAPI();
    const jobAPI = JobAPI();
    const aggregationAPI = AggregationAPI();
    const [productsID, setProductsID] = useState([]);

    const header = ["No", "ID Job", "ID Produk", "Batch No", "Expired Date", "Top Aggregation Quantity", "Order Quantity", "Job Status"];

    useEffect(() => {
        const productData = productAPI.productData;
        if (productData) {
            const updatedProducts = productData.map((product) => {
                return new Product(product.product_id, product.name, product.nie, product.het, product.storage_condition, product.aggregations);
            });
            const productsID = updatedProducts.map((product) => {
                return { value : product.id, placeholder : product.name }
            });
            setProductsID(productsID);
        }
    }, [productAPI.productData]);

    useEffect(() => {
        const jobsData = jobAPI.jobsData;
        if (jobsData && productAPI.productData) {
            const updatedJobs = jobsData.map((job) => {
                return new Job(job.job_id, job.product_id, job.batch_no, job.expired_date, job.top_order_qty, job.bottom_order_qty, job.status, job.date_created)
            });
            setJobs(updatedJobs);
            setJobDisplay(updatedJobs.map((job) => {
                return {
                    id : job.id,
                    productID : productAPI.productData.find((product) => product.product_id === job.productID).name,
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
        if (productID !== "") {
            const selectedProduct = productAPI.productData.find((product) => product.product_id === productID);
            const aggregations = aggregationAPI.aggregationsData.filter((aggregation) => aggregation.product_id === productID).map((aggregation) => {
                return new Aggregation(aggregation.id, aggregation.product_id, aggregation.name, aggregation.child_quantity, aggregation.package_code, aggregation.level, aggregation.het);
            });
            selectedProduct.aggregations = aggregations;
            const product = new Product(selectedProduct.product_id, selectedProduct.name, selectedProduct.nie, selectedProduct.het, selectedProduct.storage_condition, selectedProduct.aggregations);
            setCurrentProduct(product);
        }
    }, [productID]);

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
        const updatedData = new Job(
            currentIndex !== null ? jobs[currentIndex].id : `J${(jobs.length+1).toString().padStart(3, "0")}`,
            productID,
            batchNo,
            expiredDate,
            topQuantity,
            quantity,
            jobStatus,
            new Date().toLocaleDateString()
        );

        const handleSuccess = (updatedJobs) => {
            const jobDisplay = updatedJobs.map((job) => {
                return {
                    id : job.id,
                    productID : job.productID,
                    batchNo : job.batchNo,
                    expiredDate : job.expiredDate,
                    topAggregationQty : job.topQuantity,
                    productQty: job.orderQuantity,
                    jobStatus : job.jobStatus,
                }        
            });
            return () => {
                setJobs(updatedJobs);
                setJobDisplay(jobDisplay);
            }
        }

        if (currentIndex !== null) {
            jobAPI.updateJob(currentIndex, updatedData, handleSuccess([...jobs.slice(0, currentIndex), updatedData, ...jobs.slice(currentIndex+1)]));
        } else {
            jobAPI.insertJob(updatedData, handleSuccess([...jobs, updatedData]));
        }
    }

    function deleteData(){
        if (currentIndex === null) return;
        const handleSuccess = (updatedJobs) => {
            return () => {
                const displayJobs = updatedJobs.map((job) => {
                    return {
                        id : job.id,
                        productID : job.productID,
                        batchNo : job.batchNo,
                        expiredDate : job.expiredDate,
                        topAggregationQty : job.topQuantity,
                        productQty: job.orderQuantity,
                        jobStatus : job.jobStatus,
                    }        
                });
                setJobs(updatedJobs);
                setJobDisplay(displayJobs);
                setCurrentIndex(null);
                clearData();
            }
        }
        const updatedJobs = jobs.filter((_, index) => index !== currentIndex);
        console.log(jobs.filter((_, index) => index !== currentIndex));
        jobAPI.deleteJob(jobs[currentIndex].id, handleSuccess(updatedJobs));
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
        setQuantity(data.orderQuantity);
        setJobStatus(data.jobStatus);
        setTopQuantity(data.topQuantity);
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