import './App.css';
import Home from './Pages/Home/Home';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Registrasi from './Pages/Registrasi/Registrasi';
import Serialisasi from './Pages/Serialisasi/Serialisasi';
import JobOrder from './Pages/JobOrder/JobOrder';
import Agregasi from './Pages/Agregasi/Agregasi';
import Reporting from './Pages/Reporting/Reporting';
import { useState } from 'react';
import { productsMockData, jobsMockData } from './Utilities/MockData';

function App() {
  const [products, setProducts] = useState([...productsMockData]);
  const [jobs, setJobs] = useState([...jobsMockData]);
  const [orders, setOrders] = useState([]);
  const [masterboxs, setMasterbox] = useState([]);

  return (
    <div className="App">
      <BrowserRouter>
          <Routes>
            <Route path='/'>
              <Route index element={<Home />}></Route>
              <Route path='registrasi' element={<Registrasi/>}/>
              <Route path='jobOrder' element={<JobOrder/>}/>
              <Route path='serialisasi' element={<Serialisasi jobs={jobs} setJobs={setJobs} products={products} globalOrders={orders} setGlobalOrders={setOrders}/>} />
              <Route path='agregasi' element={<Agregasi jobs={jobs} setJobs={setJobs} products={products} globalOrders={orders} setGlobalOrders={setOrders} globalMasterboxs={masterboxs} setGlobalMasterbox={setMasterbox}/>}/>
              <Route path='reporting' element={<Reporting jobs={jobs} products={products} orders={orders} masterboxs={masterboxs}/>}/>
              <Route path='*'>404 Not Found</Route>
            </Route>
          </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
