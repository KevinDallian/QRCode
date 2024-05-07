// AgregasiController.js

import { useState, useEffect } from 'react';
import Job from '../../Models/Job';
import Product from '../../Models/Product';
import Masterbox from '../../Models/Masterbox';
import Order from '../../Models/Order';
import Aggregation from '../../Models/Aggregations'
import ProductApi from '../../Services/ProductAPI';
import MasterboxApi from '../../Services/MasterboxAPI';
import JobApi from '../../Services/JobAPI';
import OrderApi from '../../Services/OrderAPI';
import AggregationApi from '../../Services/AggregationAPI';

function AgregasiController() {
    const headers = ['No', 'Order ID', 'Masterbox ID', 'Manufacture Date', 'Status'];
    const [showJobModal, setShowJobModal] = useState(false);
    const [showEndModal, setShowEndModal] = useState(false);
    const [showPrintModal, setShowPrintModal] = useState(false);

    const [aggregationQty, setAggregationQty] = useState(0);
    const [aggregationLvl, setAggregationLvl] = useState('');
    const [currentJob, setCurrentJob] = useState({});
    const [scannedData, setScannedData] = useState([]);
    const [printData, setPrintData] = useState(null);
    const [product, setProduct] = useState(null);
    const [orders, setOrders] = useState([]);
    const [masterboxs, setMasterboxs] = useState([]);

    const jobApi = JobApi();
    const productApi = ProductApi();
    const aggregasiApi = AggregationApi();
    const masterboxApi = MasterboxApi();
    const orderApi = OrderApi();

    useEffect(() => {
        if (product !== null) {
            const aggregation = product.aggregations.find((aggregation) => aggregation.name === aggregationLvl);
            setAggregationQty(aggregation.quantity);
        } 
    }, [aggregationLvl]);

    useEffect(() => {
        if (currentJob !== null) {
            if (aggregationQty > 0 && scannedData.length >= aggregationQty) {
                printMasterBox();
            }
        }
    }, [scannedData]);

    const getProductAggregationNames = () => {
        if (product.aggregations === undefined) return [];
        return product.aggregations.map((aggregation) => aggregation.name);
    }
    
    const loadJob = async (index) => {
        const jobData = jobApi.jobsData[index];
        const job = new Job(jobData.job_id, jobData.product_id, jobData.batch_no, jobData.expired_date, jobData.topQuantity, jobData.orderQuantity, jobData.status, jobData.date_created);

        const aggregasiData = aggregasiApi.aggregationsData.filter((agregasi) => agregasi.product_id === job.productID);
        const aggregasi = aggregasiData.map((aggregation) => new Aggregation(aggregation.id, aggregation.product_id, aggregation.name, aggregation.child_quantity, aggregation.package_code, aggregation.level, aggregation.het));
        const productData = productApi.productData.find((product) => product.product_id === job.productID);
        const product = new Product(productData.product_id, productData.name, productData.nie, productData.het, productData.storage_condition, aggregasi);

        const completion = (orders) => {
            if (orders !== undefined || orders.length !== 0) {
                const updatedOrders = orders.map((order) => {
                    return new Order(order.order_id, order.job_id, order.product_id, order.masterbox_id, order.manufacture_date, order.status);
                });
                setOrders(updatedOrders);
            }
        }

        const completionMasterbox = (masterboxs) => {
            if (masterboxs !== undefined || masterboxs.length !== 0) {
                const updatedMasterboxs = masterboxs.map((masterbox) => {
                    return new Masterbox(masterbox.masterbox_id, masterbox.job_id, masterbox.product_id, masterbox.child_quantity, masterbox.manufacture_date, masterbox.status);
                });
                console.log(updatedMasterboxs);
                setMasterboxs(updatedMasterboxs);
            }
        }
        
        orderApi.fetchOrdersFromJobId(job.id, completion);

        masterboxApi.fetchDataFromJobId(job.id, completionMasterbox);
        setProduct(product);
        setCurrentJob(job);
    }

    const endJob = () => {
        const updatedJob = currentJob;
        updatedJob.jobStatus = "Ended";
        setCurrentJob(updatedJob);
        toggleModal("EndModal");
    }

    const endPrint = () => {
        setScannedData([]);
        toggleModal("PrintModal");
    }

    const toggleModal = (modalType) => {
        if (modalType === "JobModal") {
            setShowJobModal(!showJobModal);
        } else if (modalType === "EndModal") {
            setShowEndModal(!showEndModal);
        } else if (modalType === "PrintModal") {
            setShowPrintModal(!showPrintModal);
        }
    }

    const formatDate = () => {
        const date = currentJob.expiredDate;
        if (!date) return "";
        if (date instanceof Date) {
            return date.toISOString().split('T')[0];
        } else {
            return new Date(date).toISOString().split('T')[0];
        }
    }

    const scanOrder = () => {
        const aggregation = product.aggregations.find((aggregation) => aggregation.name === aggregationLvl);
        if (aggregation.level === 1) {
            const emptyMasterboxOrders = orders.filter((order) => order.masterboxID === null);
            if (emptyMasterboxOrders === undefined || emptyMasterboxOrders.length === 0) return;
            const index = scannedData.length;
            const order = emptyMasterboxOrders[index];
            const newData = {
                orderID : order.id,
                masterboxID : order.masterboxID,
                printDate : order.printDate,
                orderStatus : order.status
            };
            setScannedData([...scannedData, newData]);
        } else {
            const masterboxPrefix = aggregation.prefix;
            const filteredMasterboxes = masterboxs.filter((masterbox)=> masterbox.jobId === currentJob.id && !masterbox.id.includes(masterboxPrefix) && masterbox.masterboxID === undefined);
            if (filteredMasterboxes === undefined || filteredMasterboxes.length === 0) return;
            const index = scannedData.length;
            if (filteredMasterboxes[index] == null) return;
            const masterbox = filteredMasterboxes[index];
            const newData = {
                orderID : masterbox.id,
                masterboxID : masterbox.masterboxID || '',
                manufactureDate : new Date().toString(),
                orderStatus : masterbox.status
            };
            setScannedData([...scannedData, newData]);
        }
    }

    const printMasterBox = async () => {
        const productAggregation = product.aggregations.find((aggregation) => aggregation.name === aggregationLvl);
        const masterboxPrefix = productAggregation.prefix;
        const existingDataLength = masterboxs.filter((masterbox) => masterbox.id.includes(masterboxPrefix)).length + 1;
        const generatedID = `${product.nie}/${currentJob.batchNo}/${masterboxPrefix}${(existingDataLength).toString().padStart(3, "0")}`;
        const masterbox = new Masterbox(generatedID, currentJob.id, currentJob.productID, productAggregation.quantity, new Date().toLocaleDateString(), "Printed", productAggregation.level < product.aggregations.length ? true : false, null);
        
        const printData = {
            id : generatedID,
            productName : product.name,
            nie : product.nie,
            expiredDate : formatDate(currentJob.expiredDate),
            quantity : scannedData.length,
            storage : product.storage,
            manufacturer : "PT Samco Indonesia",
            batchNo : currentJob.batchNo,
        };

        const completion = () => {
            const aggregation = product.aggregations.find((aggregation) => aggregation.name === aggregationLvl);
                if (aggregation.level === 1) {
                    let globalArrayOrders = [...orders];
                    const updatedOrders = globalArrayOrders.map((order) => {
                        if (scannedData.find((data) => data.orderID === order.id)){
                            order.masterboxID = generatedID;
                            order.status = "Scanned";
                        }
                        return order;
                    });
                    
                    const ordersToBeUpdated = scannedData.map((data) => {
                        return data.orderID;
                    });

                    const handleSuccess = () => {
                        setOrders(updatedOrders);
                    }

                    orderApi.updateOrdersMasterbox(ordersToBeUpdated, generatedID, handleSuccess);
                } else {
                    let globalArrayMasterboxs = [...masterboxs];
                    const updatedMasterboxs = globalArrayMasterboxs.map((masterbox) => {
                        if (scannedData.find((data) => data.orderID === masterbox.id)){
                            masterbox.masterboxID = generatedID;
                            masterbox.status = "Scanned";
                        }
                        return masterbox;
                    });

                    const masterboxToBeUpdated = scannedData.map((data) => {
                        return data.orderID;
                    });

                    const handleSuccess = () => {
                        setMasterboxs(updatedMasterboxs);
                    };

                    masterboxApi.updateParentMasterbox(generatedID, masterboxToBeUpdated, handleSuccess);
                }
                setScannedData([]);
                setMasterboxs([...masterboxs, masterbox]);
                setPrintData(printData);
                toggleModal("PrintModal");
        }
        console.log(`Aggregation Level: ${aggregationLvl}`);
        console.log(product.aggregations.length);
        console.log(masterbox);
        masterboxApi.insertMasterbox(masterbox, completion);
            
    }

    return {
        showJobModal, setShowJobModal,
        showEndModal, setShowEndModal,
        showPrintModal, setShowPrintModal,
        aggregationQty, setAggregationQty,
        aggregationLvl, setAggregationLvl,
        currentJob, setCurrentJob,
        scannedData, setScannedData,
        printData, setPrintData,
        product, setProduct,
        orders, setOrders,
        masterboxs, setMasterboxs,
        getProductAggregationNames,
        loadJob,
        endJob,
        endPrint,
        toggleModal,
        formatDate,
        scanOrder,
        printMasterBox,
        headers,
        jobApi,
        productApi,
        aggregasiApi,
        masterboxApi,
        orderApi
    };
}

export default AgregasiController;