import './App.css';
import Home from './Pages/Home/Home';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Registrasi from './Pages/Registrasi/Registrasi';
import Serialisasi from './Pages/Serialisasi/Serialisasi';
import JobOrder from './Pages/JobOrder/JobOrder';
import Agregasi from './Pages/Agregasi/Agregasi';
import { useState } from 'react';

function App() {
  const [products, setProducts] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [orders, setOrders] = useState([]);
  const [masterboxs, setMasterbox] = useState([]);
  return (
    <div className="App">
      <BrowserRouter>
          <Routes>
            <Route path='/'>
              <Route index element={<Home />}></Route>
              <Route path='registrasi' element={<Registrasi products={products} setProducts={setProducts}/>}/>
              <Route path='jobOrder' element={<JobOrder jobs={jobs} setJobs={setJobs} products={products}/>}/>
              <Route path='serialisasi' element={<Serialisasi jobs={jobs} products={products} setGlobalOrders={setOrders}/>} />
              <Route path='agregasi' element={<Agregasi jobs={jobs} products={products} masterboxs={masterboxs} setGlobalMasterbox={setMasterbox}/>}/>
            </Route>
          </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
