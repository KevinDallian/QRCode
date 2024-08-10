import React from 'react';
import Order from '../../Models/Order';
import OrderAPI from '../../Services/OrderAPI';
import Product from '../../Models/Product';
import ProductAPI from '../../Services/ProductAPI';
import Masterbox from '../../Models/Masterbox';
import MasterboxAPI from '../../Services/MasterboxAPI';
import Aggregation from '../../Models/Aggregations';
import AggregationAPI from '../../Services/AggregationAPI';
import Job from '../../Models/Job';
import JobAPI from '../../Services/JobAPI';
import { useState, useEffect } from 'react';

function ReportingController() {
    const [currentProduct, setCurrentProduct] = useState('');
    const [selectedProduct, setSelectedProduct] = useState('');
    const [products, setProducts] = useState([]);
    const [masterboxsToday, setMasterboxsToday] = useState(0);
    const [ordersToday, setOrdersToday] = useState(0);

    const orderAPI = OrderAPI();
    const productAPI = ProductAPI();
    const masterboxAPI = MasterboxAPI();
    const jobAPI = JobAPI();
    const aggregationAPI = AggregationAPI();

    useEffect(() => {
        calculateMasterboxPrintedToday();
        calculateOrderPrintedToday();
    }, []);

    useEffect(() => {
        if (productAPI.productData && aggregationAPI.aggregationsData) {
            const updatedAggregations = aggregationAPI.aggregationsData.map((aggregation) => {
                return new Aggregation(aggregation.id, aggregation.product_id, aggregation.name, aggregation.child_quantity, aggregation.package_code, aggregation.level, aggregation.het);
            });
            const updatedProducts = productAPI.productData.map((product) => {
                return new Product(product.id, product.name, product.nie, product.het, product.storage_condition, updatedAggregations.filter((aggregation) => aggregation.productID === product.id));
            });
            setProducts(updatedProducts);
        }
    }, [productAPI.productData, aggregationAPI.aggregationsData]);

    useEffect(() => {
        selectProduct(selectedProduct);
    }, [selectedProduct]);

    const selectProduct = (selectedProduct) => {
        const product = products.find((product) => product.name === selectedProduct);
        if (product) {
            setCurrentProduct(product);
        }
        return null;
    }

    function calculateOrderPrintedToday() {

        const completion = (data) => {
            setOrdersToday(data.length);
        }

        orderAPI.fetchOrdersToday(completion);
    }

    function calculateMasterboxPrintedToday() {
        const completion = (data) => {
            setMasterboxsToday(data.length);
        }

        masterboxAPI.fetchMasterboxToday(completion);
    }

    return {
        products,
        selectedProduct,
        setSelectedProduct,
        masterboxsToday,
        ordersToday,
        currentProduct
    }
}

export default ReportingController;