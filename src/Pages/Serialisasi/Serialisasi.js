import './Serialisasi.css';
import { Link } from 'react-router-dom';

export default function Serialisasi(){
    return (
        <>
            <Link to='/'>Back</Link>
            <h1 className='title'>Serialisasi</h1>
            <div className='flex-row job-display'>
                <div className='col'>
                    <JobList />
                    <p>Hello</p>
                    <p>Hello</p>
                </div>
                <div className='col'>
                    <p>Hello</p>
                    <p>Hello</p>
                    <p>Hello</p>
                </div>
            </div>
        </>
    );
}

function JobList() {
    return (
        <div className='flex-space-between' style={{width : "10vw"}}>
            <h3>Job</h3>
            <h3>Detail</h3>
        </div>
    );
}