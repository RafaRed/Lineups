import React from 'react';
import ReactDOM from "react-dom/client";
import App from './App';
import MapPage from './MapPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Web3ReactProvider } from "@web3-react/core"
import { Web3Provider } from "@ethersproject/providers";

function getLibrary(provider) {
  const library = new Web3Provider(provider)
  library.pollingInterval = 12000

  return library
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Web3ReactProvider getLibrary={getLibrary}>
<Router>
    <Routes>
      <Route exact path="/" element={<App/>} />
      <Route exact path="/map" element={<MapPage/>} />
      <Route exact path="/map/:mapid" element={<MapPage/>} />
      </Routes>
    </Router>
    </Web3ReactProvider>,
    );