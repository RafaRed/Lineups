import './App.css';
import React, {useState} from 'react'
import MainPage from './pages/js/MainPage';
import Map from './pages/js/Map';
import Navbar from './components/js/Navbar';

function App() {
  const [selectedAgent,setSelectedAgent] = useState("")
  const [selectedMap,setSelectedMap] = useState("")
  return (
    <>
    <Navbar></Navbar>
    <MainPage selectedAgent={selectedAgent} setSelectedAgent={setSelectedAgent} selectedMap={selectedMap} setSelectedMap={setSelectedMap}></MainPage>
   </>
   
  );
}

export default App;
