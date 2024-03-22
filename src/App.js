import './App.css';
import Home from './Pages/Home/Home';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Registrasi from './Pages/Registrasi/Registrasi';
import Serialisasi from './Pages/Serialisasi/Serialisasi';
import JobOrder from './Pages/JobOrder/JobOrder';
import Agregasi from './Pages/Agregasi/Agregasi';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
          <Routes>
            <Route path='/'>
              <Route index element={<Home />}></Route>
              <Route path='registrasi' element={<Registrasi />}/>
              <Route path='jobOrder' element={<JobOrder />}/>
              <Route path='serialisasi' element={<Serialisasi />} />
              <Route path='agregasi' element={<Agregasi />}/>
            </Route>
          </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
