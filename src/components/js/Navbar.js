import React, { useState } from "react";
import "../css/Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import injectSheet from "react-jss";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import { injected, walletconnect, uauth, uauth2 } from "./connectors"
import { useWeb3React } from "@web3-react/core";
import { createUdAccount } from "../../model/Calls/Database";

const styles = {
	dropdownContent: {
		"&:hover": {
			display: "block",
		},
	},
	dropdown: {
		"&:hover": {
			backgroundColor: "#3e8e41",
		},
	},
};

function Navbar(props) {
	const [open, setOpen] = useState(false);

	const onOpenModal = () => setOpen(true);
	const onCloseModal = () => setOpen(false);
	const navigate = useNavigate();
	const [udLoginState, setUdLoginState] = useState(0);
	const routeChange = () => {
		let path = "/";
		navigate(path);
	};
	const [showMenu, setShowMenu] = useState(false);
	const [isConnected,setIsConnected] = useState(false)
	const [domain,setDomain] = useState("")
	fetchData(isConnected,setDomain,setIsConnected)
	return (
		<div className="navbar">
			<div className="logo" onClick={routeChange}>
				<img className="logoimg" src="/images/logo.png"></img>
				<p>LINEUPS</p>
			</div>
			<div className="login">
				<button onClick={isConnected ? ()=>logout(props.web3ReactHook,setIsConnected,setDomain) : onOpenModal}>{isConnected ? domain : "Login"}</button>
				<div>
					<Modal open={open} onClose={onCloseModal} center>
						<div className="login-panel">
							<h2>Login</h2>
							<hr class="solid"></hr>
							<img
								src={getUdLoginButton(udLoginState)}
								onMouseOver={() => setUdLoginState(1)}
								onMouseLeave={() => setUdLoginState(0)}
								onMouseDown={() => setUdLoginState(2)}
								className={["ud-login", props.classes.udLogin].join(" ")}
								onClick={()=> connectUnstoppable(props.web3ReactHook,setOpen)}
							/>
						</div>
					</Modal>
				</div>
			</div>
		</div>
	);
}

function withUseWeb3React(Component) {
	return function WrappedComponent(props) {
	  const values = useWeb3React();
	  return <Component {...props} web3ReactHook={values} />;
	};
  }
  
function getUdLoginButton(state) {
	switch (state) {
		case 0:
			return "/images/login/ud.png";
		case 1:
			return "/images/login/ud-hover.png";
		case 2:
			return "/images/login/ud-pressed.png";
	}
}

async function connectUnstoppable(web3ReactHook,setOpen) {
    injected.deactivate();
	setOpen(false);
    web3ReactHook
      .activate(uauth, null, true)
      
      .then(async (res) => {
        uauth
          .getAccount()

          .then((account) => {
			uauth.uauth.user().then(user=>{
				createUdAccount(user.sub)
			}) 
			
          })
          .catch((e) => {
            alert(e);
            console.error(e);
          });
      })
      .catch((e) => {
        alert(e);
        console.error(e);
      });
  }

  function fetchData(isConnected,setDomain,setIsConnected){
    uauth2.uauth.user()
    .then((data) => {
      if (data) {
        if(isConnected === false){
			setIsConnected(true);
			setDomain(localStorage.getItem("uauth-default-username"))
        }
        
      } else {

      }
    })
    .catch((_err) => {});
  }

  function logout(web3ReactHook,setIsConnected,setDomain) {
	setIsConnected(false);
	setDomain("")
    uauth2.uauth.logout();
    web3ReactHook.deactivate();
    injected.deactivate();
    uauth.deactivate();
    window.location.reload(false);
	

    
  }

export default injectSheet(styles)(withUseWeb3React(Navbar));
