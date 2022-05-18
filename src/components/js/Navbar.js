import React from "react";
import "../css/Navbar.css";
import {Link, useNavigate} from 'react-router-dom';
function Navbar() {
	const navigate = useNavigate();
	const routeChange = () =>{ 
		let path = "/"; 
		navigate(path);
	  }
	return (
		<div className="navbar">
			<div className="logo" onClick={routeChange}>
				<img className="logoimg" src="images/logo.png"></img>
				<p>LINEUPS</p>
			</div>
		</div>
	);
}

export default Navbar;
