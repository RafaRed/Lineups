import React, { useState, useEffect } from "react";
import "../css/Map.css";
import "../css/main.scss";
import ModalVideo from "react-modal-video";
import { useLocation } from "react-router-dom";
import { getAgents } from "../../model/agents";
import { useNavigate } from "react-router-dom";
import {
	createMap,
	getLoadMap,
	setUpdateMap,
} from "../../model/Calls/Database";
import { uauth2 } from "../../components/js/connectors";
import { useParams } from "react-router-dom";
import {getUsername} from '../../model/Calls/Login'


function changeMapName(_name, setName, setUnsaved){
	setUnsaved(true);
	setName(_name)
}
function Map() {
	const [videoOpen, setVideoOpen] = useState(false);
	const [videoData, setVideoData] = useState({"id":"","start":0});
	const params = useParams();
	const location = useLocation();
	const map_id = params.mapid;
	const [_agent_name, set_agent_name] = useState(
		location.state !== null ? location.state.agent : undefined
	);
	const [_map_name, set_map_name] = useState(
		location.state !== null ? location.state.map : undefined
	);
	const [mapOwner, setMapOwner] = useState(map_id === undefined ? true : false);

	const _agentImg = "/images/agents/" + _agent_name + ".png";
	const _abilitys = [
		"/images/abilitys/" + _agent_name + "/1.png",
		"/images/abilitys/" + _agent_name + "/2.png",
		"/images/abilitys/" + _agent_name + "/3.png",
		"/images/abilitys/" + _agent_name + "/4.png",
	];
	const _agents = getAgents();
	const _agent_path = "/images/agents/";
	const _ability_path = "/images/abilitys/";
	const [action, setAction] = useState(0);
	const [unlockAction, setUnlockAction] = useState(0);
	const [selectedAbility, setSelectedAbility] = useState(1);
	const [pixels, setPixels] = useState([]);
	const [unsaved, setUnsaved] = useState(false);
	const create_new_map = true;
	const [addlineup, setAddlineup] = useState(false);
	const [username,setUsername] = useState(undefined);
	const [author,setAuthor] = useState("Author")
	const [lineupName, setLineupName] = useState("Lineups")
	
	useEffect(() => {
		getUsername().then(user=>{
			setUsername(user)
		})
	}, []);

	useEffect(() => {
		loadMap(set_agent_name, set_map_name, map_id, setPixels, setMapOwner, username, setAuthor, setLineupName);
		
	}, [username]);

	return (
		<div className="map-page">
			<ModalVideo
				channel="youtube"
				isOpen={videoOpen}
				autoplay
				videoId={videoData["id"]}
				youtube={{start:videoData["start"],autoplay:1}}
				onClose={() => setVideoOpen(false)}
			/>
			<div className="block">
				<p className="title">{lineupName}</p>
				<p>Author</p>
			</div>

			{mapOwner === false ? (
				<></>
			) : (
				<div className="config-block">
					<div className="options-block">
					<input placeholder={"Lineup"} className="input-name" onChange={v => changeMapName(v.target.value,setLineupName,setUnsaved)}></input>
						<button
							className={unsaved === true ? "save-button-unsaved" : "save-button"}
							onClick={() =>
								saveMapClick(
									create_new_map,
									map_id,
									setUnsaved,
									pixels,
									_agent_name,
									_map_name,
									username,
									lineupName
								)
							}>
							SAVE
						</button>
						<button className="add-lineup-button" onClick={() => setAddlineup(true)}>
							ADD LINEUP
						</button>
					</div>

					{addlineup ? (
						<AddLineupMenu
							_agent_name={_agent_name}
							_agentImg={_agentImg}
							_abilitys={_abilitys}
							_agents={_agents}
							_ability_path={_ability_path}
							action={action}
							setAction={setAction}
							unlockAction={unlockAction}
							setUnlockAction={setUnlockAction}
							selectedAbility={selectedAbility}
							setSelectedAbility={setSelectedAbility}
							setUnsaved={setUnsaved}
							setAddlineup={setAddlineup}
							pixels={pixels}
							setPixels={setPixels}
							></AddLineupMenu>
					) : (
						<></>
					)}
				</div>
			)}

			<MapArea
				_map_name={_map_name}
				_agentImg={_agentImg}
				selectedAbility={selectedAbility}
				action={action}
				setAction={setAction}
				pixels={pixels}
				setPixels={setPixels}
				_agent_name={_agent_name}
				_agent_path={_agent_path}
				_ability_path={_ability_path}
				_agents={_agents}
				unlockAction={unlockAction}
				map_id={map_id}
				setUnlockAction={setUnlockAction}
				setVideoOpen={setVideoOpen}
				setVideoData={setVideoData}
				videoData={videoData}
				addlineup={addlineup}
				></MapArea>
		</div>
	);
}

function videoWrapper(url) {
	var videoData = {};
	var base = ["https://youtu.be/"];
	//https://youtu.be/sNaUDfsSmlg?t=5
	for (var i = 0; i < base.length; i++) {
		if (url.includes(base) && i == 0) {
			videoData["id"] = getId(url, base[0]);
			videoData["start"] = getStart(url)
			break;
		}
	}

	return videoData;
}

function getId(url, base) {
	var id = "";
	var tmp = url.replace(base, "");
	if (tmp.includes("?")) {
		id = tmp.split("?")[0];
	} else {
		id = tmp;
	}
	return id;
}

function getStart(url) {
	var start = 0;
	const regex = /(t=[0-9]*)/g;
	const match = url.match(regex);
	if(match.length >= 1){
		start = match[0].replace("t=","")
	}
	return start
}

function saveMapClick(
	create_new_map,
	map_id,
	setUnsaved,
	pixels,
	_agent_name,
	_map_name,
	username,
	lineupName
) {
	if (map_id === undefined) {
		saveMap(create_new_map, map_id, setUnsaved, pixels, _agent_name, _map_name,username,lineupName);
	} else {
		updateMap(create_new_map, map_id, setUnsaved, pixels, _agent_name, _map_name,username,lineupName);
	}
}

function loadMap(set_agent_name, set_map_name, map_id, setPixels, setMapOwner, username, setAuthor, setLineupName) {
		getLoadMap(map_id).then((data) => {

		if(data !== null){
			set_agent_name(data.agentName);
			set_map_name(data.mapName);
			setPixels(data.pixels);
			if (username === data.username.replace("*", ".")) {
				setMapOwner(true);
			}
			setAuthor(data.username)
			setLineupName(data.name)
		}
		
		

	});
}
function saveMap(
	create_map_path,
	map_id,
	setUnsaved,
	pixels,
	agentName,
	mapName,
	username,
	lineupName
) {
	setUnsaved(false);
		createMap(username, pixels, agentName, mapName,lineupName).then((mapid) => {
			window.location.href = "/map/" + mapid;
		});
}

function updateMap(
	create_map_path,
	map_id,
	setUnsaved,
	pixels,
	agentName,
	mapName,
	username,
	lineupName
) {
	setUnsaved(false);
	setUpdateMap(username, pixels, agentName, mapName, map_id,lineupName);
}

function CheckVariablesLoaded(props) {
	const _agent_name = props._agent_name;
	const _map_name = props._map_name;
	let navigate = useNavigate();
	const routeChange = () => {
		let path = "/";
		navigate(path);
	};
	useEffect(() => {
		if (_agent_name === undefined || _map_name === undefined) {
			if (props.map_id === undefined) {
				routeChange();
			}
		}
	});
}

function AddLineupMenu(props) {
	return (
		<div className="lineup-block">
			<p className="menu-title">ADD LINEUP</p>
			<SetAgentLayout
				_agentImg={props._agentImg}
				action={props.action}
				setAction={props.setAction}
				unlockAction={props.unlockAction}
				setUnlockAction={props.setUnlockAction}></SetAgentLayout>
			<SetAbility
				_abilitys={props._abilitys}
				selectedAbility={props.selectedAbility}
				setSelectedAbility={props.setSelectedAbility}
				setAction={props.setAction}
				unlockAction={props.unlockAction}></SetAbility>
			<AbilityPosition
				selectedAbility={props.selectedAbility}
				_ability_path={props._ability_path}
				_agents={props._agents}
				_agent_name={props._agent_name}
				action={props.action}
				setAction={props.setAction}
				unlockAction={props.unlockAction}
				setUnlockAction={props.setUnlockAction}></AbilityPosition>
			<VideoUrl unlockAction={props.unlockAction} setPixels={props.setPixels} pixels={props.pixels}></VideoUrl>
			<button
				className="line-add"
				onClick={() =>
					addLineupToMap(
						props.setAddlineup,
						props.setUnlockAction,
						props.setAction,
						props.setUnsaved
					)
				}>
				ADD
			</button>
		</div>
	);
}
function addLineupToMap(setAddlineup, setUnlockAction, setAction, setUnsaved) {
	setAddlineup(false);
	setUnlockAction(1);
	setAction(0);
	setUnsaved(true);

}

function SetAgentLayout(props) {
	return (
		<div className="line-block">
			<p className="line-title">1. SET AGENT POSITION</p>
			<button className="line-button" onClick={() => setAgent(props.setAction)}>
				<img className="line-img" src={props._agentImg} />{" "}
				{props.action === 1
					? "PLACE AGENT ON MAP"
					: props.unlockAction > 3
					? "UPDATE POSITION"
					: "SET"}
			</button>
		</div>
	);
}

function setAgent(setAction) {
	setAction(1);
}

function SetAbility(props) {
	return (
		<div
			className={props.unlockAction >= 2 ? "line-block" : "line-block-disabled"}>
			<p className="line-title">2. SET AGENT ABILITY</p>
			<div className="abilitys-select">
				<button
					className={
						props.selectedAbility === 1 ? "ability-button-selected" : "ability-button"
					}
					onClick={() =>
						changeAbility(
							1,
							props.setSelectedAbility,
							props.setAction,
							props.unlockAction
						)
					}>
					<img className="ability-img" src={props._abilitys[0]} />
				</button>
				<button
					className={
						props.selectedAbility === 2 ? "ability-button-selected" : "ability-button"
					}
					onClick={() =>
						changeAbility(
							2,
							props.setSelectedAbility,
							props.setAction,
							props.unlockAction
						)
					}>
					<img className="ability-img" src={props._abilitys[1]} />
				</button>
				<button
					className={
						props.selectedAbility === 3 ? "ability-button-selected" : "ability-button"
					}
					onClick={() =>
						changeAbility(
							3,
							props.setSelectedAbility,
							props.setAction,
							props.unlockAction
						)
					}>
					<img className="ability-img" src={props._abilitys[2]} />
				</button>
				<button
					className={
						props.selectedAbility === 4 ? "ability-button-selected" : "ability-button"
					}
					onClick={() =>
						changeAbility(
							4,
							props.setSelectedAbility,
							props.setAction,
							props.unlockAction
						)
					}>
					<img className="ability-img" src={props._abilitys[3]} />
				</button>
			</div>
		</div>
	);
}

function changeAbility(id, setSelectedAbility, setAction, unlockAction) {
	if (unlockAction >= 2) {
		setSelectedAbility(id);
		setAction(3);
	}
}

function AbilityPosition(props) {
	return (
		<div
			className={props.unlockAction >= 2 ? "line-block" : "line-block-disabled"}>
			<p className="line-title">3. SET ABILITY POSITION</p>
			<button
				className="line-button"
				onClick={() => setAbility(props.setAction, props.unlockAction)}>
				<img
					className="line-img"
					src={
						props._ability_path +
						props._agent_name +
						"/" +
						props.selectedAbility +
						".png"
					}
				/>
				{props.action === 4
					? "PLACE ABILITY ON MAP"
					: props.unlockAction > 4
					? "UPDATE POSITION"
					: "SET"}
			</button>
		</div>
	);
}
function setAbility(setAction, unlockAction) {
	if (unlockAction >= 2) {
		setAction(4);
	}
}

function VideoUrl(props) {
	return (
		<div
			className={props.unlockAction >= 4 ? "line-block" : "line-block-disabled"}>
			<p className="line-title">4. VIDEO URL</p>
			<input placeholder="youtube.com/xxx" className="line-input" onChange={v => UpdateVideoUrl(v.target.value,props.setPixels,props.pixels)}></input>
		</div>
	);
}

function UpdateVideoUrl(url,setPixels,pixels){
	var oldPixels = [...pixels];
	oldPixels[oldPixels.length - 1]["url"] = url;
	setPixels(oldPixels);
}

function MapArea(props) {
	return (
		<div className="map-img">
			<CheckVariablesLoaded
				_agent_name={props._agent_name}
				_map_name={props._map_name}
				map_id={props.map_id}
			/>
			{(props.action === 1 || props.action === 4) ? <svg id="map-click" width="1024" height="1024" viewBox="0 0 1536 1536" onClick={(e) => mapClick(e, props)}></svg> : ""}
			<svg id="map" width="1024" height="1024" viewBox="0 0 1536 1536">
				{props._map_name === undefined ? (
					<></>
				) : (
					<image
						href={"/images/maps/" + props._map_name + ".png"}
						width="1024"
						height="1024"
						
					/>
				)}

				<LoadPixels
					pixels={props.pixels}
					_agent_path={props._agent_path}
					_ability_path={props._ability_path}
					_agents={props._agents}
					setVideoOpen={props.setVideoOpen}
					setVideoData={props.setVideoData}
					addlineup={props.addlineup}
					action={props.action}
				/>
			</svg>
		</div>
	);
}

function showVideo(setVideoData,setVideoOpen,url){
	if(url !== undefined){
		setVideoData(videoWrapper(url))
		setVideoOpen(true)
	}
	
}

function LoadPixels({
	pixels,
	_agent_path,
	_ability_path,
	_agents,
	setVideoOpen,
	setVideoData,
	addlineup,
	action
}) {
	var PixelsLayout = [];
	for (var i = 0; i < pixels.length; i++) {
		var pixel = [];
		const url = pixels[i]["url"]
		if ("agent-x" in pixels[i] && "ability-x" in pixels[i]) {
			pixel.push(
				<line
					key={i + "_0"}
					x1={parseInt(pixels[i]["ability-x"]) + 15}
					y1={parseInt(pixels[i]["ability-y"]) + 30}
					x2={parseInt(pixels[i]["agent-x"]) + 15}
					y2={parseInt(pixels[i]["agent-y"])}
					strokeWidth="2"
					stroke="white"
				/>
			);
		}

		if ("agent-x" in pixels[i]) {
			pixel.push(
				<svg id="pixel-box" key={i + "_1"}>
					<rect
						onClick={(e) => showVideo(setVideoData,setVideoOpen,url)}
						x={pixels[i]["agent-x"] - 3}
						y={pixels[i]["agent-y"] - 2}
						rx="10"
						ry="10"
						width="35"
						height="35"
					/>
				</svg>
			);
			pixel.push(
				<image
				onClick={(e) => showVideo(setVideoData,setVideoOpen,url)}
					id="agent"
					href={_agent_path + pixels[i]["agent-id"] + ".png"}
					x={pixels[i]["agent-x"]}
					y={pixels[i]["agent-y"]}
					width="30px"
					height="30px"
					key={i + "_2"}
				/>
			);
		}
		if ("ability-x" in pixels[i]) {
			pixel.push(
				<svg id="pixel-box" key={i + "_3"} onClick={(e) => showVideo(setVideoData,setVideoOpen,url)}>
					<rect
						x={pixels[i]["ability-x"] - 3}
						y={pixels[i]["ability-y"] - 2}
						rx="10"
						ry="10"
						width="35"
						height="35"
						url={url}
					/>
				</svg>
			);
			pixel.push(
				<image
				onClick={(e) => showVideo(setVideoData,setVideoOpen,url)}
					key={i + "_4"}
					id="agent"
					href={
						_ability_path +
						pixels[i]["agent-id"] +
						"/" +
						pixels[i]["ability-id"] +
						".png"
					}
					x={pixels[i]["ability-x"]}
					y={pixels[i]["ability-y"]}
					width="30px"
					height="30px"
				/>
			);
		}

		PixelsLayout.push(
			<g key={i + "__0"} id={"pixel" + i}>
				{pixel}
			</g>
		);
	}
	return PixelsLayout;
}

function mapClick(evt, props) {
	var e = evt.target;
	var dim = e.getBoundingClientRect();
	var x = evt.clientX - dim.left;
	var y = evt.clientY - dim.top;
	if (props.action === 1) {
		if (props.unlockAction > 2) {
			updateAgent(x * 1.5 - 15, y * 1.5 - 15, props);
		} else {
			placeAgent(x * 1.5 - 15, y * 1.5 - 15, props);
		}

		if (props.unlockAction < 3) {
			props.setUnlockAction(3);
		}
	}
	if (props.action === 4) {
		placeAbility(x * 1.5 - 15, y * 1.5 - 15, props);

		if (props.unlockAction < 5) {
			props.setUnlockAction(5);
		}
	}
}

function placeAgent(x, y, props) {
	var oldPixels = [...props.pixels];
	oldPixels.push({ "agent-id": props._agent_name, "agent-x": x, "agent-y": y });
	props.setPixels(oldPixels);
	props.setAction(2);
}

function updateAgent(x, y, props) {
	var oldPixels = [...props.pixels];
	oldPixels[oldPixels.length - 1]["agent-id"] = props._agent_name;
	oldPixels[oldPixels.length - 1]["agent-x"] = x;
	oldPixels[oldPixels.length - 1]["agent-y"] = y;
	props.setPixels(oldPixels);
	props.setAction(props.unlockAction);
}

function placeAbility(x, y, props) {
	var oldPixels = [...props.pixels];
	oldPixels[oldPixels.length - 1]["ability-id"] = props.selectedAbility;
	oldPixels[oldPixels.length - 1]["ability-x"] = x;
	oldPixels[oldPixels.length - 1]["ability-y"] = y;
	props.setPixels(oldPixels);
	props.setAction(5);
}
export default Map;
