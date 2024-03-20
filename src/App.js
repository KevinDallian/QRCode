import './App.css';
import DisplayButton from './Components/DisplayButton/DisplayButton';
import registrasiLogo from './Assets/registrasi.svg';
import jobLogo from './Assets/job.svg';
import serialisasiLogo from './Assets/serialisasi.svg';
import agregasiLogo from './Assets/agregasi.svg';

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
