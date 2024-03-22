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
    
    const header = ["ID Produk", "Nama Produk", "NIE", "HET", "Kuantitas per Box", "Storage"];
    const [data, setData] = useState([
        {id : "PR001", name : "Obat Insto", nie : "DTL2038202646A1", het : "50000", quantity : "50", storage : "Simpan dalam suhu ruangan"},
    ]);

    function addData() {
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
        console.log("Data added");
        console.log(data);
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
                <ActionButton name={"Delete"} color='#ffa2a2'/>
                <div>
                    <ActionButton name={"Clear"} color='#fdff9b'/>
                    <ActionButton name={"Save"} color='#b5f9b8' onClickFunction={addData}/>
                </div>
            </div>
            <div id='table'>
                <ReactTable headers={header} datas={data}/>
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