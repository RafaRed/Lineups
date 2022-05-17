import React, { useState, useEffect } from "react";
import "../css/Map.css";
import { PanZoom } from "react-easy-panzoom";



function Map() {
	const _agent_id = 0;
	const _agentImg = "images/agents/fade.png";
	const _abilitys = [
		"images/abilitys/fade/1.png",
		"images/abilitys/fade/2.png",
		"images/abilitys/fade/3.png",
		"images/abilitys/fade/4.png",
	];
	const _agents = ["fade"];
	const _agent_path = "images/agents/";
	const _ability_path = "images/abilitys/";
	const [action, setAction] = useState(0);
	const [unlockAction, setUnlockAction] = useState(0);
	const [selectedAbility, setSelectedAbility] = useState(1);
	const [pixels, setPixels] = useState([]);

	const [addlineup,setAddlineup] = useState(false)
	return (
		<div className="map-page">
			<div className="block">
				<p className="title">Lineups Name</p>
				<p>Author</p>
			</div>

			<div className="config-block">
				<div className="options-block">
					<p className="menu-title">OPTIONS</p>
					<button className="save-button">SAVE</button>
					<button className="add-lineup-button" onClick={()=>setAddlineup(true)}>ADD LINEUP</button>
				</div>

				{addlineup ? <AddLineupMenu
					_agent_id={_agent_id}
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
					setAddlineup={setAddlineup}></AddLineupMenu> : <></>}
			</div>

			<MapArea
				_agentImg={_agentImg}
				selectedAbility={selectedAbility}
				action={action}
				setAction={setAction}
				pixels={pixels}
				setPixels={setPixels}
				_agent_id={_agent_id}
				_agent_path={_agent_path}
				_ability_path={_ability_path}
				_agents={_agents}
				unlockAction={unlockAction}
				setUnlockAction={setUnlockAction}></MapArea>
		</div>
	);
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
				_agent_id={props._agent_id}
				action={props.action}
				setAction={props.setAction}
				unlockAction={props.unlockAction}
				setUnlockAction={props.setUnlockAction}></AbilityPosition>
			<VideoUrl unlockAction={props.unlockAction}></VideoUrl>
			<button className="line-add" onClick={()=>addLineupToMap(props.setAddlineup, props.setUnlockAction, props.setAction)}>ADD</button>
		</div>
	);
}
function addLineupToMap(setAddlineup, setUnlockAction, setAction){
	setAddlineup(false)
	setUnlockAction(1)
	setAction(0)
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
						changeAbility(4, props.setSelectedAbility, props.setAction)
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
						props._agents[props._agent_id] +
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
			<input placeholder="youtube.com/xxx" className="line-input"></input>
		</div>
	);
}

function MapArea(props) {
	return (
		<div className="map-img">
			<svg id="map" width="1024" height="1024" viewBox="0 0 1536 1536">
				<image
					href="images/maps/ascent.png"
					width="1024"
					height="1024"
					onClick={(e) => mapClick(e, props)}
				/>
				<LoadPixels
					pixels={props.pixels}
					_agent_path={props._agent_path}
					_ability_path={props._ability_path}
					_agents={props._agents}
				/>
			</svg>
		</div>
	);
}

function LoadPixels({ pixels, _agent_path, _ability_path, _agents }) {
	var PixelsLayout = [];
	for (var i = 0; i < pixels.length; i++) {
		var pixel = [];
		if ("agent-x" in pixels[i] && "ability-x" in pixels[i]) {
			pixel.push(
				<line
					x1={parseInt(pixels[i]["ability-x"]) + 15}
					y1={parseInt(pixels[i]["ability-y"]) + 30}
					x2={parseInt(pixels[i]["agent-x"]) + 15}
					y2={parseInt(pixels[i]["agent-y"])}
					stroke-width="2"
					stroke="white"
				/>
			);
		}

		if ("agent-x" in pixels[i]) {
			pixel.push(
				<svg id="pixel-box">
					<rect
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
					id="agent"
					href={_agent_path + _agents[pixels[i]["agent-id"]] + ".png"}
					x={pixels[i]["agent-x"]}
					y={pixels[i]["agent-y"]}
					width="30px"
					height="30px"
				/>
			);
		}
		if ("ability-x" in pixels[i]) {
			pixel.push(
				<svg id="pixel-box">
					<rect
						x={pixels[i]["ability-x"] - 3}
						y={pixels[i]["ability-y"] - 2}
						rx="10"
						ry="10"
						width="35"
						height="35"
					/>
				</svg>
			);
			pixel.push(
				<image
					id="agent"
					href={
						_ability_path +
						_agents[pixels[i]["agent-id"]] +
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

		PixelsLayout.push(<g id={"pixel" + i}>{pixel}</g>);
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
	oldPixels.push({ "agent-id": props._agent_id, "agent-x": x, "agent-y": y });
	props.setPixels(oldPixels);
	props.setAction(2);
}

function updateAgent(x, y, props) {
	var oldPixels = [...props.pixels];
	oldPixels[oldPixels.length - 1]["agent-id"] = props._agent_id;
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
