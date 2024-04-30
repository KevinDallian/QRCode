import { useEffect, useState } from 'react';
import './Registrasi.css';
import ActionButton from '../../Components/ActionButton/ActionButton';
import ReactTable from '../../Components/Table/ReactTable';
import { Link } from 'react-router-dom';
import { FormDetail, OptionForm } from '../../Components/FormDetail/FormDetail';
import DynamicForm from '../../Components/DynamicForm/DynamicForm';
import useFetch from '../../Hooks/Api';
import APICalls from '../../Utilities/APICalls';
import Product from '../../Models/Product';
import Aggregation from '../../Models/Aggregations';

export default function Registrasi(){
    const [name, setName] = useState('');
    const [nie, setNIE] = useState('');
    const [het, setHET] = useState('');
    const [storage, setStorage] = useState('');
    const [currentIndex, setCurrentIndex] = useState(null);
    const [aggregationLvl, setAggregationLvl] = useState(1);
    const [aggregations, setAggregations] = useState([{name:'', quantity:0, level: 1}]);

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
    
    const header = ["No", "ID Produk", "Nama Produk", "NIE", "HET", "Storage", "Aggregation Level"];

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
        let newFields = [];
        for (let i=0;i<quantity;i++) {
            newFields.push({name:'', quantity:0, prefix:'', level: i+1});
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
        if (currentIndex !== null) {
            const updatedData = {
                id: currentProducts[currentIndex].id,
                name: name,
                nie: nie,
                het: het,
                storage: storage,
                aggregations: aggregations
            };
            const updateDisplayData = {
                id: currentProducts[currentIndex].id,
                name: name,
                nie: nie,
                het: het,
                storage: storage,
                aggregationLvl: aggregations.length
            }
            const newData = [...currentProducts.slice(0, currentIndex), updatedData, ...currentProducts.slice(currentIndex + 1)];
            const newDisplayData = [...displayProducts.slice(0, currentIndex), updateDisplayData, ...displayProducts.slice(currentIndex + 1)];
            setCurrentProducts(newData);
            setDisplayProducts(newDisplayData);
        } else {
            const existingDataLength = currentProducts.length;
            const generatedID = `PR${(existingDataLength+1).toString().padStart(3, "0")}`;
            const newData = {
                id : generatedID,
                name : name,
                nie : nie,
                het : het,
                storage : storage,
                aggregations : aggregations
            };
            const newDisplayData = {
                id: generatedID,
                name: name,
                nie: nie,
                het: het,
                storage: storage,
                aggregationLvl: aggregations.length
            }
            setCurrentProducts([...currentProducts, newData]);
            setDisplayProducts([...displayProducts, newDisplayData]);
        }
    }

    function deleteData(){
        const newData = [...currentProducts.slice(0, currentIndex), ...currentProducts.slice(currentIndex+1)];
        const newDisplayData = [...displayProducts.slice(0, currentIndex), ...displayProducts.slice(currentIndex+1)];
        setCurrentProducts(newData);
        setDisplayProducts(newDisplayData);
        setCurrentIndex(null);
        clearData();
    }

    function clearData(){
        setName('');
        setNIE('');
        setHET('');
        setStorage('');
        setCurrentIndex(null);
        setAggregationLvl(1);
    }

    return (
        <>
            <Link to="/">Back</Link>
            <h1 className='title'>Registrasi Produk</h1>
            <div className='flex-space-between form-border'>
                <form id='form'>
                    <FormDetail variableName={"Nama Produk"} value={name} setValue={(e)=>setName(e)} />
                    <FormDetail variableName={"NIE"} value={nie} setValue={(e)=>setNIE(e)}/>
                    <FormDetail variableName={"HET"} value={het} setValue={(e)=>setHET(e)}/>
                    <FormDetail variableName={"Storage"} value={storage} setValue={(e)=>setStorage(e)}/>
                </form>
                <div>
                    <OptionForm variableName={"Level Agregasi"} options={[1, 2, 3]} value={aggregationLvl} setValue={setAggregationLvl} hasDefaultValue={false}/>
                    <DynamicForm aggregations={aggregations} onFormDataChange={onAggregationFormChange}/>
                </div>
                <div id='twoBtn' className='flex-column'>
                    <ActionButton name={"Import"} color='#f1f1f1' onClickFunction={()=> {console.log('Import')}}/>
                    <ActionButton name={"Export"} color='#f1f1f1' onClickFunction={()=> {console.log('Export')}}/>
                </div>
            </div>
            
            <div id='buttonRow'>
                <ActionButton name={"Delete"} color='#ffa2a2' onClickFunction={deleteData} disabled={currentIndex == null}/>
                <div>
                    <ActionButton name={"Clear"} color='#fdff9b' onClickFunction={clearData}/>
                    <ActionButton name={"Save"} color='#b5f9b8' onClickFunction={saveData} disabled={validateData()}/>
                </div>
            </div>
            <div id='table'>
                <ReactTable headers={header} datas={displayProducts} currentIndex={currentIndex} onClickHandler={onClickRow}/>
            </div>
        </>
    );
}