import { create_map_path, create_ud_account_path, load_maps_path, load_map_path, server, update_map_path } from "../repository";

export async function createUdAccount(username) {
	const requestOptions = {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({username:username}),
	};
	return new Promise((resolve, reject) => {
		fetch(server + create_ud_account_path, requestOptions)
			.then((response) => response.json())
			.then((data) => resolve(data));
	});
}

export async function createMap(_username,_pixels,_agentName,_mapName,_lineupName) {
	const requestOptions = {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({username:_username, pixels:_pixels,agentName:_agentName,mapName:_mapName,name:_lineupName}),
	};
	return new Promise((resolve, reject) => {
		fetch(server + create_map_path, requestOptions)
			.then((response) => response.json())
			.then((data) => resolve(data));
	});
}

export async function getLoadMap(_map_id) {
	const requestOptions = {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({map_id:_map_id}),
	};
	return new Promise((resolve, reject) => {
		fetch(server + load_map_path, requestOptions)
			.then((response) => response.json())
			.then((data) => resolve(data));
	});
}

export async function getLoadMaps(_username) {
	const requestOptions = {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({username:_username}),
	};
	return new Promise((resolve, reject) => {
		fetch(server + load_maps_path, requestOptions)
			.then((response) => response.json())
			.then((data) => resolve(data));
	});
}

export async function setUpdateMap(_username,_pixels,_agentName,_mapName,_map_id,_lineupName) {
	const requestOptions = {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({username:_username, pixels:_pixels,agentName:_agentName,mapName:_mapName,mapId:_map_id,name:_lineupName}),
	};
	return new Promise((resolve, reject) => {
		fetch(server + update_map_path, requestOptions)
			.then((response) => response.json())
			.then((data) => resolve(data));
	});
}