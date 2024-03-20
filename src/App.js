import './App.css';
import DisplayButton from './Components/DisplayButton/DisplayButton';
import registrasiLogo from './Assets/registrasi.png';
import jobLogo from './Assets/job.png';
import serialisasiLogo from './Assets/serialisasi.png';
import agregasiLogo from './Assets/agregasi.png';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <DisplayButton image={registrasiLogo} text={"Registrasi Produk"}></DisplayButton>
        <DisplayButton image={jobLogo} text={"Job Order"}></DisplayButton>
        <DisplayButton image={serialisasiLogo} text={"Serialisasi"}></DisplayButton>
        <DisplayButton image={agregasiLogo} text={"Agregasi"}></DisplayButton>
      </header>
    </div>
  );
}

export default App;
