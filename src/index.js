import React from 'react';
import ReactDOM from "react-dom";
import App from './App';
import MapPage from './MapPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

ReactDOM.render(
<Router>
    <Routes>
      <Route exact path="/" element={<App/>} />
      <Route exact path="/map" element={<MapPage/>} />
      </Routes>
    </Router>,
    document.getElementById("root")
    );