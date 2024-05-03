import { useState, useEffect } from 'react';
import Product from '../../Models/Product';
import Aggregation from '../../Models/Aggregations';
import ProductAPI from '../../Services/ProductAPI';
import AggregationAPI from '../../Services/AggregationAPI';

function RegistrasiController() {
    const [name, setName] = useState('');
    const [nie, setNIE] = useState('');
    const [het, setHET] = useState('');
    const [storage, setStorage] = useState('');
    const [currentIndex, setCurrentIndex] = useState(null);
    const [aggregationLvl, setAggregationLvl] = useState(1);
    const [aggregations, setAggregations] = useState([{name:'', quantity:0, level: 1, het: 0}]);
    const header = ["No", "ID Produk", "Nama Produk", "NIE", "HET", "Storage", "Aggregation Level"];

    const [currentProducts, setCurrentProducts] = useState([]);
    const [displayProducts, setDisplayProducts] = useState([]);
    const productAPI = ProductAPI();
    const aggregationAPI = AggregationAPI();

    useEffect(() => {
        if (productAPI.productData && aggregationAPI.aggregationsData) {
            const productData = productAPI.productData;
            const aggregationsData = aggregationAPI.aggregationsData;
            
            const updatedAggregations = aggregationsData.map((aggregation) => {
                return new Aggregation(aggregation.id, aggregation.product_id, aggregation.name, aggregation.child_quantity, aggregation.package_code, aggregation.level, aggregation.het);
            });
            
            const updatedProducts = productData.map((product) => {
                return new Product(product.product_id, product.name, product.nie, product.het, product.storage_condition, updatedAggregations.filter((aggregation) => aggregation.productId === product.product_id));
            });

            setCurrentProducts(updatedProducts);
            const displayProducts = updatedProducts.map((product) => {
                return {
                    id: product.id,
                    name: product.name,
                    nie: product.nie,
                    het: product.het,
                    storage: product.storage,
                    aggregationLvl: product.aggregations.length
                };
            });
            setDisplayProducts(displayProducts);
        }
    }, [productAPI.productData, aggregationAPI.aggregationsData]);
    

    useEffect(() => {
        if (aggregations.length !== aggregationLvl) {
            setAggregationForm(aggregationLvl);
        }
    }, [aggregationLvl]);

    const onAggregationFormChange = (index, event) => {
        let data = [...aggregations];
        if (!data[index]) {
            return
        }
        data[index][event.target.name] = event.target.value;
        setAggregations(data);
    }
    
    const setAggregationForm = (quantity) => {
        const newFields = Array.from({ length: quantity }, (_, i) => ({ name: '', quantity: 0, prefix: '', het: 0, level: i + 1 }));
        const existingAggregation = currentProducts[currentIndex]?.aggregations;
        if (existingAggregation) {
            newFields.forEach((field, index) => {
                if (existingAggregation[index]) {
                    Object.assign(field, existingAggregation[index]);
                }
            });
        }
        setAggregations(newFields);
    }

    function validateData(){
        return name === "" || nie === "" || het === "" || storage === "" ||  aggregations.some((aggregation) => aggregation.name === "" || aggregation.quantity === 0);
    }

    function onClickRow(index){
        setCurrentIndex(index);
        const selectedData = currentProducts[index];
        setFormData(selectedData);
    }

    function setFormData(data){
        setName(data.name);
        setNIE(data.nie);
        setHET(data.het);
        setStorage(data.storage);
        setAggregationLvl(data.aggregations.length);
        setAggregations(data.aggregations);
    }

    function saveData() {
        const updatedProduct = new Product(
            currentIndex !== null ? currentProducts[currentIndex].id : `PR${(currentProducts.length + 1).toString().padStart(3, "0")}`,
            name,
            nie,
            het,
            storage,
            aggregations
        );

        const updatedAggregations = aggregations.map((aggregation) => {
            return new Aggregation(
                aggregation.id,
                updatedProduct.id,
                aggregation.name,
                aggregation.quantity,
                aggregation.prefix,
                aggregation.level,
                aggregation.het
            );
        });

        const handleSuccess = (updatedProducts, updatedAggregations) => {
            return () => {
                const newAggregations = updatedAggregations.filter((aggregation) => aggregation.id === null);
                const aggregationsToBeUpdated = updatedAggregations.filter((aggregation) => aggregation.id !== null);
                const aggregationsToBeDeleted = currentProducts[currentIndex]?.aggregations.filter((existingAggregation) => {
                    return !updatedAggregations.some((updatedAggregation) => updatedAggregation.id === existingAggregation.id);
                });

                if (newAggregations.length > 0) {
                    aggregationAPI.insertAggregations(newAggregations);
                }
                if (aggregationsToBeUpdated.length > 0) {
                    aggregationAPI.updateAggregations(aggregationsToBeUpdated);
                }
                if (aggregationsToBeDeleted.length > 0) {
                    aggregationsToBeDeleted.forEach((aggregation) => {
                        aggregationAPI.deleteAggregations(aggregation.id);
                    });
                }

                const updatedDisplayProducts = updatedProducts.map(product => ({
                    id: product.id,
                    name: product.name,
                    nie: product.nie,
                    het: product.het,
                    storage: product.storage,
                    aggregationLvl: product.aggregations.length
                }));

                setCurrentProducts(updatedProducts);
                setDisplayProducts(updatedDisplayProducts);
            }
        }

        if (currentIndex !== null) {
            productAPI.updateProduct(currentProducts[currentIndex].id, updatedProduct, handleSuccess([...currentProducts.slice(0, currentIndex), updatedProduct, ...currentProducts.slice(currentIndex + 1)], updatedAggregations));
        } else {
            productAPI.insertProduct(updatedProduct, handleSuccess([...currentProducts, updatedProduct], updatedAggregations));
        }
    }

    function deleteData() {
        if (currentIndex !== null) {
            const aggregations = currentProducts[currentIndex].aggregations;
            aggregations.forEach((aggregation) => {
                aggregationAPI.deleteAggregations(aggregation.id);
            });

            const updatedProducts = currentProducts.filter((_, index) => index !== currentIndex);
            const handleSuccess = (updatedProducts) => {
                return () => {
                    const updatedDisplayProducts = updatedProducts.map(product => ({
                        id: product.id,
                        name: product.name,
                        nie: product.nie,
                        het: product.het,
                        storage: product.storage,
                        aggregationLvl: product.aggregations.length || 0
                    }));
                    setCurrentProducts(updatedProducts);
                    setDisplayProducts(updatedDisplayProducts);
                    setCurrentIndex(null);
                    clearData();
                }
            }
            productAPI.deleteProduct(currentProducts[currentIndex].id, handleSuccess(updatedProducts));
        }
    }

    function clearData(){
        setName('');
        setNIE('');
        setHET('');
        setStorage('');
        setCurrentIndex(null);
        setAggregationLvl(1);
    }
    
    return {
        name,
        setName,
        nie,
        setNIE,
        het,
        setHET,
        storage,
        setStorage,
        currentIndex,
        setCurrentIndex,
        aggregationLvl,
        setAggregationLvl,
        aggregations,
        setAggregations,
        currentProducts,
        displayProducts,
        saveData,
        deleteData,
        clearData,
        onAggregationFormChange,
        header,
        validateData,
        onClickRow
    };
}

export default RegistrasiController;