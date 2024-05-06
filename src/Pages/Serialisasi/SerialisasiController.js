import { useState } from 'react';
import Job from '../../Models/Job';
import Order from '../../Models/Order';
import ProductApi from '../../Services/ProductAPI';
import JobApi from '../../Services/JobAPI';
import OrderApi from '../../Services/OrderAPI';

function SerialisasiController(){
    const headers = ['No', 'Order ID', 'Job ID', 'Masterbox ID', 'Manufacture Date', 'Status'];

    const [showJobModal, setShowJobModal] = useState(false);
    const [showEndModal, setShowEndModal] = useState(false);
    const [currentJob, setCurrentJob] = useState({});
    const [showPrintModal, setShowPrintModal] = useState(false);
    const [orders, setOrders] = useState([]);
    const [ordersDisplay, setOrdersDisplay] = useState([]);

    const jobApi = JobApi();
    const productApi = ProductApi();
    const orderApi = OrderApi();

    const loadJob = async (index) => {
        const job = jobApi.jobsData[index];
        const updatedJob = new Job(job.job_id, job.product_id, job.batch_no, job.expired_date, job.top_order_qty, job.bottom_order_qty , job.status, job.date_created);
        const product = productApi.productData.find((product) => product.product_id === updatedJob.productID);
        setCurrentJob(updatedJob);

        const completion = (orders) => {
            if (orders.length > 0) {
                const updatedOrders = orders.map((order) => {
                    return new Order(order.order_id, order.job_id, order.product_id, null, null, order.status);
                });
                const orderDisplay = updatedOrders.map((data, index) => {
                    return {
                        id : data.id,
                        jobID : data.jobID,
                        masterboxID : data.masterboxID,
                        manufactureDate : data.manufactureDate,
                        status : data.status,
                    }
                })
                setOrders(updatedOrders);
                setOrdersDisplay(orderDisplay);
            } else {
                generateData(updatedJob, product);
            }
        }
        
        orderApi.fetchOrdersFromJobId(updatedJob.id, completion);
    }

    const endJob = () => {
        const updatedJob = currentJob;
        updatedJob.jobStatus = "Ended";
        setCurrentJob(updatedJob);
        toggleModal("EndModal");
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

    const endPrint = () => {
        setOrders([]);
        const updatedJob = currentJob;
        updatedJob.jobStatus = "Printed";
        toggleModal("PrintModal");
    }

    const formatDate = (date) => {
        if (!date) return "";
        if (date instanceof Date) {
            return date.toISOString().split('T')[0];
        } else {
            return new Date(date).toISOString().split('T')[0];
        }
    }

    const printData = () => {
        const ordersTobePrinted = orders.map((order) => {
            order.status = "Printed";
            order.manufactureDate = new Date().toLocaleDateString();
            return order;
        });

        const handleSuccess = () => {
            setOrders(ordersTobePrinted);
            setOrdersDisplay(ordersTobePrinted.map((data) => {
                return {
                    id : data.id,
                    jobID : data.jobID,
                    masterboxID : data.masterboxID,
                    manufactureDate : data.manufactureDate,
                    status : data.status,
                }
            }));
            toggleModal("PrintModal");
        }

        orderApi.updateOrders(ordersTobePrinted, handleSuccess);
    }

    const generateData = (job, product) => {
        const generatedData = Array.from({ length: job.orderQuantity }, (_, index) => {
            const generatedID = `(90)${product.nie}(91)${formatDate(job.expiredDate)}(00)${job.batchNo}(01)${(index + 1).toString().padStart(3, "0")}`;
            return new Order(generatedID, job.id, product.product_id, null, null, "Not Printed");
        });
        
        const handleSuccess = (datas) => {
            const ordersDisplay = datas.map((data) => {
                return {
                    id : data.id,
                    jobID : data.jobID,
                    masterboxID : data.masterboxID,
                    manufactureDate : data.manufactureDate,
                    status : data.status,
                }
            });
            return () => {
                setOrders(datas);
                setOrdersDisplay(ordersDisplay);
            }
        }
        orderApi.insertOrders(generatedData, handleSuccess(generatedData));
    }

    return {
        headers,
        showJobModal, setShowJobModal,
        showEndModal, setShowEndModal,
        currentJob, setCurrentJob,
        showPrintModal, setShowPrintModal,
        orders, setOrders,
        ordersDisplay, setOrdersDisplay,
        jobApi,
        productApi,
        orderApi,
        loadJob,
        endJob,
        toggleModal,
        endPrint,
        formatDate,
        printData,
        generateData
    };
};

export default SerialisasiController;