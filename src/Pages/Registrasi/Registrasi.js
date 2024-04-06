import { useEffect, useState } from 'react';
import './Registrasi.css';
import ActionButton from '../../Components/ActionButton/ActionButton';
import ReactTable from '../../Components/Table/ReactTable';
import { Link } from 'react-router-dom';
import { FormDetail, OptionForm } from '../../Components/FormDetail/FormDetail';
import DynamicForm from '../../Components/DynamicForm/DynamicForm';

export default function Registrasi({products, setProducts}){
    const [name, setName] = useState('');
    const [nie, setNIE] = useState('');
    const [het, setHET] = useState('');
    const [storage, setStorage] = useState('');
    const [currentIndex, setCurrentIndex] = useState(null);
    const [aggregationLvl, setAggregationLvl] = useState(0);
    const [aggregations, setAggregations] = useState([]);
    
    const header = ["No", "ID Produk", "Nama Produk", "NIE", "HET", "Storage"];

    const onAggregationFormChange = (index, event) => {
        let data = [...aggregations];
        
        if (!data[index]) {
            return
        }
        data[index][event.target.name] = event.target.value;
        setAggregations(data);
    }

    const setAggregationForm = (quantity) => {
        let newFields = [{}];
        for (let i=1;i<quantity;i++) {
            newFields.push({name:'', quantity:0});
        }
        setAggregations(newFields);
    }
    
    useEffect(() => {
        setAggregationForm(aggregationLvl);
    }, [aggregationLvl, setAggregationLvl]);

    function validateData(){
        return name === "" || nie === "" || het === "" || storage === "";
    }

    function onClickRow(index){
        setCurrentIndex(index);
        
        const selectedData = products[index];
        setFormData(selectedData)
    }

    function saveData() {
        if (currentIndex !== null) {
            const updatedData = {
                id: products[currentIndex].id,
                name: name,
                nie: nie,
                het: het,
                storage: storage,
              };
              const newData = [...products.slice(0, currentIndex), updatedData, ...products.slice(currentIndex + 1)];
              setProducts(newData);
        } else {
            const existingDataLength = products.length;
            const generatedID = `PR${(existingDataLength+1).toString().padStart(3, "0")}`;
            const newData = {
                id : generatedID,
                name : name,
                nie : nie,
                het : het,
                storage : storage
            };
            setProducts([...products, newData]);
        }
    }

    function deleteData(){
        const newData = [...products.slice(0, currentIndex), ...products.slice(currentIndex+1)];
        setProducts(newData);
        setCurrentIndex(null);
        clearData();
    }

    function clearData(){
        setName('');
        setNIE('');
        setHET('');
        setStorage('');
        setCurrentIndex(null);
    }
    
    function setFormData(data){
        setName(data.name);
        setNIE(data.nie);
        setHET(data.het);
        setStorage(data.storage);
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
                    <OptionForm variableName={"Aggregation Level"} options={[1, 2, 3]} value={aggregationLvl} setValue={setAggregationLvl} hasDefaultValue={false}/>
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
                <ReactTable headers={header} datas={products} currentIndex={currentIndex} onClickHandler={onClickRow}/>
            </div>
        </>
    );
}