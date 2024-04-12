import DisplayButton from '../../Components/DisplayButton/DisplayButton';
import registrasiLogo from '../../Assets/registrasi.svg';
import jobLogo from '../../Assets/job.svg';
import serialisasiLogo from '../../Assets/serialisasi.svg';
import agregasiLogo from '../../Assets/agregasi.svg';
import reportingLogo from '../../Assets/reporting.svg';
import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
    return (
        <>
        <div className='layout'>
            <Link className='homeLink' to="/registrasi"> <DisplayButton image={registrasiLogo} text={"Registrasi Produk"}/> </Link>
            <Link className='homeLink' to="/jobOrder"> <DisplayButton image={jobLogo} text={"Job Order"}/> </Link>
            <Link className='homeLink' to="/serialisasi"> <DisplayButton image={serialisasiLogo} text={"Serialisasi"}/> </Link>
            <Link className='homeLink' to="/agregasi"> <DisplayButton image={agregasiLogo} text={"Agregasi"}/> </Link>
            <Link className='homeLink' to="/reporting"> <DisplayButton image={reportingLogo} text={"Reporting"}/> </Link>
        </div>
        </>
    );
}