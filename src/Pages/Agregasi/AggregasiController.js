// AgregasiController.js

import { useState, useEffect } from 'react';
import Job from '../../Models/Job';
import Product from '../../Models/Product';
import Masterbox from '../../Models/Masterbox';
import Order from '../../Models/Order';
import Aggregation from '../../Models/Aggregations'
import ProductAPI from '../../Services/ProductAPI';
import MasterboxAPI from '../../Services/MasterboxAPI';
import JobAPI from '../../Services/JobAPI';
import OrderAPI from '../../Services/OrderAPI';
import AggregationAPI from '../../Services/AggregationAPI';

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

    const productAPI = ProductAPI();
    const aggregasiAPI = AggregationAPI();
    const masterboxAPI = MasterboxAPI();
    const jobAPI = JobAPI();
    const orderAPI = OrderAPI();

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

    const getProductAggregationNames = (product) => {
        if (product.aggregations === undefined) return [];
        return product.aggregations.map((aggregation) => aggregation.name);
    }
    
    const loadJob = (index) => {
        const jobData = jobAPI.jobsData[index];
        const job = new Job(jobData.job_id, jobData.product_id, jobData.batch_no, jobData.expired_date, jobData.topQuantity, jobData.orderQuantity, jobData.job_status, jobData.date_created);

        const aggregasiData = aggregasiAPI.agregasiData.filter((agregasi) => agregasi.product_id === job.productID);
        const aggregasi = aggregasiData.map((aggregation) => new Aggregation(aggregation.id, aggregation.product_id, aggregation.name, aggregation.child_quantity, aggregation.package_code, aggregation.level, aggregation.het));
        const productData = productAPI.productData.find((product) => product.product_id === job.productID);
        const product = new Product(productData.product_id, productData.name, productData.nie, productData.het, productData.storage, aggregasi);

        const orders = orderAPI.fetchOrdersFromJobId(job.id);
        if (orders !== undefined || orders.length !== 0) {
            setOrders(orders);
        }

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

    const formatDate = (date) => {
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
            const orders = orders.filter((order) => order.jobID === currentJob.id && order.masterboxID === "");
            if (orders === undefined || orders.length === 0) return;
            const index = scannedData.length;
            const order = orders[index];
            const newData = {
                orderID : order.id,
                masterboxID : order.masterboxID,
                printDate : order.printDate,
                orderStatus : order.status
            };
            setScannedData([...scannedData, newData]);
        } else {
            const masterboxPrefix = aggregation.prefix;
            const masterboxs = masterboxs.filter((masterbox)=> masterbox.jobID === currentJob.id && !masterbox.id.includes(masterboxPrefix) &&masterbox.masterboxID === undefined);
            if (masterboxs === undefined || masterboxs.length === 0) return;
            const index = scannedData.length;
            if (masterboxs[index] == null) return;
            const masterbox = masterboxs[index];
            const newData = {
                orderID : masterbox.id,
                masterboxID : masterbox.masterboxID || '',
                manufactureDate : new Date().toString(),
                orderStatus : masterbox.status
            };
            setScannedData([...scannedData, newData]);
        }
    }

    const printMasterBox = () => {
        const productAggregation = product.aggregations.find((aggregation) => aggregation.name === aggregationLvl);
        const masterboxPrefix = productAggregation.prefix;
        const existingDataLength = masterboxs.filter((masterbox) => masterbox.id.includes(masterboxPrefix)).length + 1;
        const generatedID = `${product.nie}/${currentJob.batchNo}/${masterboxPrefix}${(existingDataLength).toString().padStart(3, "0")}`;
        const masterbox = {
            id : generatedID,
            productID : currentJob.productID,
            jobID : currentJob.id,
            printDate : new Date().toLocaleDateString(),
        }
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
            setOrders(updatedOrders);
        } else {
            let globalArrayMasterboxs = [...masterboxs];
            const updatedMasterboxs = globalArrayMasterboxs.map((masterbox) => {
                if (scannedData.find((data) => data.orderID === masterbox.id)){
                    masterbox.masterboxID = generatedID;
                    masterbox.status = "Scanned";
                }
                return masterbox;
            });
            setMasterboxs(updatedMasterboxs);
        }
        setScannedData([]);
        setMasterboxs([...masterboxs, masterbox]);
        setPrintData(printData);
        toggleModal("PrintModal");
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
        getProductAggregationNames,
        loadJob,
        endJob,
        endPrint,
        toggleModal,
        formatDate,
        scanOrder,
        printMasterBox,
        headers
    };
}

export default AgregasiController;