import React, { useState, useEffect } from "react";
import "../css/MainPage.css";
import { getAgents } from "../../model/agents";
import { getMaps } from "../../model/maps";
import injectSheet from "react-jss";
import {Link, useNavigate} from 'react-router-dom';
import { uauth2 } from "../../components/js/connectors"
import { getLoadMaps } from "../../model/Calls/Database";

function MainPage(props) {
	const [maps,setMaps] = useState();
	useEffect(()=>{
		loadMaps(setMaps,maps);
	},[])
	return (
		<div className="main-page">
			<div className="wrapper">
				<Welcome></Welcome>
				<SelectAgent
					buttonStyle={props.classes.button}
					agent={props.selectedAgent}
					setAgent={props.setSelectedAgent}></SelectAgent>
				<SelectMap
					buttonStyle={props.classes.button}
					map={props.selectedMap}
					setMap={props.setSelectedMap}></SelectMap>
				<Load agent={props.selectedAgent} map={props.selectedMap} maps={maps}></Load>
				<CreateNewButton buttonStyle={props.classes.buttonCreate} _agent={props.selectedAgent} _map={props.selectedMap}></CreateNewButton>
			</div>
		</div>
	);
}

function loadMaps(setMaps,_maps){
	uauth2.uauth.user().then(user=>{
		getLoadMaps(user.sub).then(maps=>
			{
				setMaps(maps)
			})
	})
}
function Welcome() {
	return (
		<div className="title">
			<div className="bar"></div>
			<div className="title-tags">
				<p>WELCOME TO</p>
				<p className="red-text">LINEUPS</p>
			</div>
		</div>
	);
}

function SelectAgent({ buttonStyle, agent, setAgent }) {
	const agents = getAgents();
	return (
		<div className="block">
			<p className="block-title">
				<span className="main-text">SELECT</span> AN AGENT
			</p>
			<BuildAgentsList
				buttonStyle={buttonStyle}
				agents={agents}
				agent={agent}
				setAgent={setAgent}></BuildAgentsList>
		</div>
	);
}

function BuildAgentsList({ buttonStyle, agents, agent, setAgent }) {
	const AgentList = [];
	for (var i = 0; i < agents.length; i++) {
		const _agent = agents[i]
		AgentList.push(
			<div
				key={i}
				className={[
					agent === agents[i] ? "selected-agent" : "agent",
					agent === agents[i] ? "" : buttonStyle,
				].join(" ")}
				onClick={()=>setAgent(_agent)}>
				<img src={"/images/agents/" + agents[i] + ".png"} />
			</div>
		);
	}

	return <div className={"agents-list"}>{AgentList}</div>;
}

function SelectMap({ buttonStyle, map, setMap }) {
	const maps = getMaps();
	return (
		<div className="block">
			<p className="block-title">
				<span className="main-text">SELECT</span> A MAP
			</p>
			<BuildMapsList
				buttonStyle={buttonStyle}
				maps={maps}
				map={map}
				setMap={setMap}></BuildMapsList>
		</div>
	);
}

function BuildMapsList({ buttonStyle, maps, map, setMap }) {
	const MapsList = [];

	for (var i = 0; i < maps.length; i++) {
		const _map = maps[i]
		MapsList.push(
			<div
				key={i}
				className={[map === maps[i] ? "selected-map" : "map", map === maps[i]?"":buttonStyle].join(
					" "
				)}
				onClick={() => setMap(_map)}>
				{capitalizeFirstLetter(maps[i])}
			</div>
		);
	}
	return <div className="maps-list">{MapsList}</div>;
}

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function Load({agent,map,maps}) {
	return (
		<div className="block">
			<p className="block-title">
				<span className="main-text">LOAD</span>
			</p>
			<LoadedMaps agent={agent} map={map} maps={maps}></LoadedMaps>
			<p className="maps-found">{mapsNumber(maps,map,agent)} maps found</p>
		</div>
	);
}

function mapsNumber(maps,map,agent){
	if(maps !== undefined && map in maps && agent in maps[map])
		{return Object.keys(maps[map][agent]).length}
		else{
			return 0
		}
}

function LoadedMaps(props){
	var loadedMaps = []

	if(props.maps !== undefined && (props.map !== undefined && props.agent !== undefined)){

		if(props.map in props.maps && props.agent in props.maps[props.map] ){
			var mapList = props.maps[props.map][props.agent];

			for (const [key, value] of Object.entries(mapList)) {
	
				loadedMaps.push(<a href={"/map/"+key} key={key}><div className="map-button">{mapList[key].name}</div></a>)
			}
		}
		
	}
	
	return <div className="map-list">{loadedMaps}</div>;
}


function CreateNewButton({ buttonStyle,_agent,_map}) {
	let navigate = useNavigate(); 
	const routeChange = () =>{ 
		let path = `map`; 
		navigate(path,{state:{agent:_agent,map:_map}});
	  }
	return (

		<button className={["create-new", buttonStyle].join(" ")} onClick={routeChange}>
			+ CREATE NEW
		</button>
	);
}

const styles = {
	button: {
		"&:hover": {
			backgroundColor: "#5a5a5a",
		},
	},
	buttonCreate: {
		"&:hover": {
			backgroundColor: "#ff6875",
		},
	},
};

export default injectSheet(styles)(MainPage);
