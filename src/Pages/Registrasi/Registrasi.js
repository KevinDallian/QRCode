import './Registrasi.css';
import ActionButton from '../../Components/ActionButton/ActionButton';
import ReactTable from '../../Components/Table/ReactTable';
import { Link } from 'react-router-dom';
import { FormDetail, OptionForm } from '../../Components/FormDetail/FormDetail';
import DynamicForm from '../../Components/DynamicForm/DynamicForm';
import RegistrasiController from './RegistrasiController';

export default function Registrasi(){
    const controller = RegistrasiController();
    
    return (
        <>
            <Link to="/">Back</Link>
            <h1 className='title'>Registrasi Produk</h1>
            <div className='flex-space-between form-border'>
                <form id='form'>
                    <FormDetail variableName={"Nama Produk"} value={controller.name} setValue={(e)=>controller.setName(e)} />
                    <FormDetail variableName={"NIE"} value={controller.nie} setValue={(e)=>controller.setNIE(e)}/> 
                    <FormDetail variableName={"HET"} value={controller.het} setValue={(e)=>controller.setHET(e)}/>
                    <FormDetail variableName={"Storage"} value={controller.storage} setValue={(e)=>controller.setStorage(e)}/>
                </form>
                <div>
                    <OptionForm variableName={"Level Agregasi"} options={[1, 2, 3]} value={controller.aggregationLvl} setValue={controller.setAggregationLvl} hasDefaultValue={false}/>
                    <DynamicForm aggregations={controller.aggregations} onFormDataChange={controller.onAggregationFormChange}/>
                </div>
                <div id='twoBtn' className='flex-column'>
                    <ActionButton name={"Import"} color='#f1f1f1' onClickFunction={()=> {console.log('Import')}}/>
                    <ActionButton name={"Export"} color='#f1f1f1' onClickFunction={()=> {console.log('Export')}}/>
                </div>
            </div>
            
            <div id='buttonRow'>
                <ActionButton name={"Delete"} color='#ffa2a2' onClickFunction={controller.deleteData} disabled={controller.currentIndex == null}/>
                <div>
                    <ActionButton name={"Clear"} color='#fdff9b' onClickFunction={controller.clearData}/>
                    <ActionButton name={"Save"} color='#b5f9b8' onClickFunction={controller.saveData} disabled={controller.validateData()}/>
                </div>
            </div>
            <div id='table'>
                <ReactTable headers={controller.header} datas={controller.displayProducts} currentIndex={controller.currentIndex} onClickHandler={controller.onClickRow}/>
            </div>
        </>
    );
}