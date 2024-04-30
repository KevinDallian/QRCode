import { useState, useEffect } from 'react';
import { updateProduct, insertProduct, deleteProduct } from '../../Utilities/API/Api';
import useFetch from '../../Utilities/API/UseFetch';
import APICalls from '../../Utilities/API/APICalls';
import Product from '../../Models/Product';
import Aggregation from '../../Models/Aggregations';

function RegistrasiController() {
    const [name, setName] = useState('');
    const [nie, setNIE] = useState('');
    const [het, setHET] = useState('');
    const [storage, setStorage] = useState('');
    const [currentIndex, setCurrentIndex] = useState(null);
    const [aggregationLvl, setAggregationLvl] = useState(1);
    const [aggregations, setAggregations] = useState([{name:'', quantity:0, level: 1}]);
    const header = ["No", "ID Produk", "Nama Produk", "NIE", "HET", "Storage", "Aggregation Level"];

    const {data : productData} = useFetch(APICalls.baseProducts);
    const {data : aggregationsData} = useFetch(APICalls.baseAggregations);
    const [currentProducts, setCurrentProducts] = useState([]);
    const [displayProducts, setDisplayProducts] = useState([]);

    useEffect(() => {
        if (productData && aggregationsData) {
            const updatedAggregations = aggregationsData.map((aggregation) => {
                return new Aggregation(aggregation.id, aggregation.product_id, aggregation.name, aggregation.child_quantity, aggregation.package_code, aggregation.level);
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
    }, [productData, aggregationsData])
    

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
        const newFields = Array.from({ length: quantity }, (_, i) => ({ name: '', quantity: 0, prefix: '', level: i + 1 }));
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

        const handleSuccess = (updatedProducts) => {
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

        if (currentIndex !== null) {
            updateProduct(currentProducts[currentIndex].id, updatedProduct)
                .then((response) => {
                    if (response.status === 200) {
                        handleSuccess([
                            ...currentProducts.slice(0, currentIndex),
                            updatedProduct,
                            ...currentProducts.slice(currentIndex + 1)
                        ]);
                        alert('Produk Update Berhasil!');
                    }
                    else {
                        alert(`Produk Update Gagal! ${response.error}`);
                    }
                });
        } else {
            insertProduct(updatedProduct)
                .then((response) => {
                    if (response.status === 200) {
                        handleSuccess([...currentProducts, updatedProduct]);
                        alert('Produk Insert Berhasil!');
                    } else {
                        alert(`Produk Insert Gagal! ${response.error}`)
                    }
                });
        }
    }

    function deleteData() {
        if (currentIndex !== null) {
            const updatedProducts = currentProducts.filter((_, index) => index !== currentIndex);
            const updatedDisplayProducts = updatedProducts.map(product => ({
                id: product.id,
                name: product.name,
                nie: product.nie,
                het: product.het,
                storage: product.storage,
                aggregationLvl: product.aggregations.length
            }));

            deleteProduct(currentProducts[currentIndex].id)
                .then((response) => {
                    console.log(response);
                    if (response.status === 200) {
                        alert('Produk Berhasil Dihapus!');
                        setCurrentProducts(updatedProducts);
                        setDisplayProducts(updatedDisplayProducts);
                        setCurrentIndex(null);
                        clearData();
                    } else {
                        alert(`Produk Gagal Dihapus! ${response.error}`);
                    }
                })
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