import './Registrasi.css';
import ActionButton from '../../Components/ActionButton/ActionButton';
import ReactTable from '../../Components/Table/ReactTable';
import { Link } from 'react-router-dom';
import { FormDetail, OptionForm } from '../../Components/FormDetail/FormDetail';
import DynamicForm from '../../Components/DynamicForm/DynamicForm';
import RegistrasiController from './RegistrasiController';

export default function Registrasi(){
    const {
        name,
        setName,
        nie,
        setNIE,
        het,
        setHET,
        storage,
        setStorage,
        currentIndex,
        aggregationLvl,
        setAggregationLvl,
        aggregations,
        displayProducts,
        saveData,
        deleteData,
        clearData,
        onAggregationFormChange,
        header,
        validateData,
        onClickRow
    } = RegistrasiController();
    
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