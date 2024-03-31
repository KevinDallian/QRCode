import './App.css';
import Home from './Pages/Home/Home';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Registrasi from './Pages/Registrasi/Registrasi';
import Serialisasi from './Pages/Serialisasi/Serialisasi';
import JobOrder from './Pages/JobOrder/JobOrder';
import Agregasi from './Pages/Agregasi/Agregasi';
import DataDemo from './Pages/DataDemo/DataDemo';
import { useState } from 'react';

function App() {
  // const [products, setProducts] = useState([{id: "PR001", name: "Paracetamol", nie: "123456", het: 25000, quantity: 100, storage: "Simpan dalam suhu ruangan"}]);
  // const [jobs, setJobs] = useState([{id: "J001", productID: "PR001", batchNo: "B001", expiredDate: "12/12/2022", quantity: 100, jobStatus: "Active"}]);
  // const [orders, setOrders] = useState([{id: "O001", jobID: "J001", masterboxID: "M001", manufactureDate: "12/12/2022", status: "Active"}, {id: "O002", jobID: "J001", masterboxID: "M001", manufactureDate: "12/12/2022", status: "Active"}]);
  // const [masterboxs, setMasterbox] = useState([{id: "M001", productID: "PR001", jobID: "J001"}]);
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
              <Route path='serialisasi' element={<Serialisasi jobs={jobs} products={products} globalOrders={orders} setGlobalOrders={setOrders}/>} />
              <Route path='agregasi' element={<Agregasi jobs={jobs} products={products} globalOrders={orders} setGlobalOrders={setOrders} masterboxs={masterboxs} setGlobalMasterbox={setMasterbox}/>}/>
              <Route path='dataDemo' element={<DataDemo jobs={jobs} products={products} orders={orders} masterboxs={masterboxs}/>}/>
              <Route path='*'>404 Not Found</Route>
            </Route>
          </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
