import { useState } from 'react';
import './Registrasi.css';
import ActionButton from '../../Components/ActionButton/ActionButton';

export default function Registrasi(){
    const [name, setName] = useState('');
    const [nie, setNIE] = useState('');
    const [het, setHET] = useState('');
    const [quantity, setQuantity] = useState('');
    const [storage, setStorage] = useState('');

    return (
        <>
            <h1 id='title'>Registrasi Produk</h1>
            <form id='form'>
                <FormDetail variableName={"Nama Produk"} value={name} setValue={()=>setName()} />
                <FormDetail variableName={"NIE"} value={nie} setValue={()=>setNIE()}/>
                <FormDetail variableName={"HET"} value={het} setValue={()=>setHET()}/>
                <FormDetail variableName={"Kuantitas per Box"} value={quantity} setValue={()=>setQuantity()}/>
                <FormDetail variableName={"Storage"} value={storage} setValue={()=>setStorage()}/>
            </form>
            <div id='buttonRow'>
                <ActionButton name={"Delete"} color='#ffa2a2'/>
                <div>
                    <ActionButton name={"Clear"} color='#fdff9b'/>
                    <ActionButton name={"Save"} color='#b5f9b8'/>
                </div>
                
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