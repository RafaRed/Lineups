import React from 'react';
import ReactDOM from "react-dom";
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


ReactDOM.render(
  <Web3ReactProvider getLibrary={getLibrary}>
<Router>
    <Routes>
      <Route exact path="/" element={<App/>} />
      <Route exact path="/map" element={<MapPage/>} />
      </Routes>
    </Router>
    </Web3ReactProvider>,
    document.getElementById("root")
    );