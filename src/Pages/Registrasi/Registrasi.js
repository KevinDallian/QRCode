import { useState } from 'react';
import './Registrasi.css';
import ActionButton from '../../Components/ActionButton/ActionButton';
import ReactTable from '../../Components/Table/ReactTable';

export default function Registrasi(){
    const [name, setName] = useState('');
    const [nie, setNIE] = useState('');
    const [het, setHET] = useState('');
    const [quantity, setQuantity] = useState('');
    const [storage, setStorage] = useState('');
    const [currentIndex, setCurrentIndex] = useState(null);
    
    const header = ["ID Produk", "Nama Produk", "NIE", "HET", "Kuantitas per Box", "Storage"];
    const [data, setData] = useState([
        {id : "PR001", name : "Obat Insto", nie : "DTL2038202646A1", het : "50000", quantity : "50", storage : "Simpan dalam suhu ruangan"},
    ]);

    function validateData(){
        return name == "" || nie == "" || het == "" || quantity == "" || storage == "";
    }

    function onClickRow(index){
        setCurrentIndex(index);
        
        const selectedData = data[index];
        setFormData(selectedData)
    }

    function saveData() {
        if (currentIndex !== null) {
            const updatedData = {
                id: data[currentIndex].id,
                name: name,
                nie: nie,
                het: het,
                quantity: quantity,
                storage: storage,
              };
              const newData = [...data.slice(0, currentIndex), updatedData, ...data.slice(currentIndex + 1)];
              setData(newData);
        } else {
            const existingDataLength = data.length;
            const generatedID = `PR${(existingDataLength+1).toString().padStart(3, "0")}`;
            const newData = {
                id : generatedID,
                name : name,
                nie : nie,
                het : het,
                quantity : quantity,
                storage : storage
            };
            setData([...data, newData]);
        }
    }

    function deleteData(){
        const newData = [...data.slice(0, currentIndex), ...data.slice(currentIndex+1)];
        setData(newData);
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
            <h1 id='title'>Registrasi Produk</h1>
            <form id='form'>
                <FormDetail variableName={"Nama Produk"} value={name} setValue={(e)=>setName(e)} />
                <FormDetail variableName={"NIE"} value={nie} setValue={(e)=>setNIE(e)}/>
                <FormDetail variableName={"HET"} value={het} setValue={(e)=>setHET(e)}/>
                <FormDetail variableName={"Kuantitas per Box"} value={quantity} setValue={(e)=>setQuantity(e)}/>
                <FormDetail variableName={"Storage"} value={storage} setValue={(e)=>setStorage(e)}/>
            </form>
            <div id='buttonRow'>
                <ActionButton name={"Delete"} color='#ffa2a2' onClickFunction={deleteData} disabled={currentIndex == null}/>
                <div>
                    <ActionButton name={"Clear"} color='#fdff9b' onClickFunction={clearData}/>
                    <ActionButton name={"Save"} color='#b5f9b8' onClickFunction={saveData} disabled={validateData()}/>
                </div>
            </div>
            <div id='table'>
                <ReactTable headers={header} datas={data} currentIndex={currentIndex} onClickHandler={onClickRow}/>
            </div>
        </>
    );
}

export function FormDetail({variableName, value, setValue}){
    return (
        <div className='box'>
            <label>{variableName}</label>
            <input value={value} onChange={(e)=>setValue(e.target.value)}/>
        </div>
    );
}