import { useState } from 'react';
import './Registrasi.css';
import ActionButton from '../../Components/ActionButton/ActionButton';
import ReactTable from '../../Components/Table/ReactTable';
import { Link } from 'react-router-dom';
import { FormDetail } from '../../Components/FormDetail/FormDetail';

export default function Registrasi({products, setProducts}){
    const [name, setName] = useState('');
    const [nie, setNIE] = useState('');
    const [het, setHET] = useState('');
    const [quantity, setQuantity] = useState('');
    const [storage, setStorage] = useState('');
    const [currentIndex, setCurrentIndex] = useState(null);
    
    const header = ["No", "ID Produk", "Nama Produk", "NIE", "HET", "Kuantitas per Box", "Storage"];

    function validateData(){
        return name === "" || nie === "" || het === "" || quantity === "" || storage === "";
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
                quantity: quantity,
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
                quantity : quantity,
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
        setQuantity('');
        setStorage('');
        setCurrentIndex(null);
    }
    
    function setFormData(data){
        setName(data.name);
        setNIE(data.nie);
        setHET(data.het);
        setQuantity(data.quantity);
        setStorage(data.storage);
    }
    
    return (
        <>
            <Link to="/">Back</Link>
            <h1 className='title'>Registrasi Produk</h1>
            <div className='flex-row'>
                <form id='form'>
                    <FormDetail variableName={"Nama Produk"} value={name} setValue={(e)=>setName(e)} />
                    <FormDetail variableName={"NIE"} value={nie} setValue={(e)=>setNIE(e)}/>
                    <FormDetail variableName={"HET"} value={het} setValue={(e)=>setHET(e)}/>
                    <FormDetail variableName={"Kuantitas per Box"} value={quantity} setValue={(e)=>setQuantity(e)}/>
                    <FormDetail variableName={"Storage"} value={storage} setValue={(e)=>setStorage(e)}/>
                </form>
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