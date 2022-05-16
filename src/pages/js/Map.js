import React from "react";
import "../css/Map.css";
import { PanZoom } from 'react-easy-panzoom'

function Map() {
	const _agentImg = "images/agents/fade.png";
	const _abilitys = [
		"images/abilitys/fade/1.png",
		"images/abilitys/fade/2.png",
		"images/abilitys/fade/3.png",
		"images/abilitys/fade/4.png",
	];
	const _selectedAbility = "images/abilitys/fade/1.png";

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
					<button className="add-lineup-button">ADD LINEUP</button>
				</div>

				<div className="lineup-block">
					<p className="menu-title">ADD LINEUP</p>

					<div className="line-block">
						<p className="line-title">1. SET AGENT POSITION</p>
						<button className="line-button">
							<img className="line-img" src={_agentImg} /> SET
						</button>
					</div>

					<div className="line-block">
						<p className="line-title">2. SET AGENT ABILITY</p>
						<div className="abilitys-select">
							<button className="ability-button">
								<img className="ability-img" src={_abilitys[0]} />
							</button>
							<button className="ability-button">
								<img className="ability-img" src={_abilitys[1]} />
							</button>
							<button className="ability-button">
								<img className="ability-img" src={_abilitys[2]} />
							</button>
							<button className="ability-button">
								<img className="ability-img" src={_abilitys[3]} />
							</button>
						</div>
					</div>

					<div className="line-block">
						<p className="line-title">3. SET ABILITY POSITION</p>
						<button className="line-button">
							<img className="line-img" src={_selectedAbility} /> SET
						</button>
					</div>

					<div className="line-block">
						<p className="line-title">4. VIDEO URL</p>
						<input placeholder="youtube.com/xxx" className="line-input"></input>
					</div>

					<button className="line-add">ADD</button>
				</div>
			</div>
			
			<div className="map-img">
			<PanZoom  boundaryRatioVertical={0.05} 
      boundaryRatioHorizontal={0.05}
	  maxZoom={1}
	  minZoom={0.3}
      enableBoundingBox>
				<svg id="map" width="1024" height="1024" viewBox="0 0 1200 1200" onClick={(e) => mapClick(e)}>
					<image href="images/maps/ascent.png" width="1024" height="1024"  />
					<g id="pixel0">
						<svg id="pixel-box">
							<rect x="157" y="248" rx="10" ry="10" width="35" height="35" />
						</svg>
						<image
							id="pixel"
							href={_selectedAbility}
							x="160"
							y="250"
							width="30px"
							height="30px"
						/>
						<svg id="pixel-box">
							<rect x="157" y="498" rx="10" ry="10" width="35" height="35" />
						</svg>
						<image
							id="agent"
							href={_agentImg}
							x="160"
							y="500"
							width="30px"
							height="30px"
						/>
						<line x1="175" y1="285" x2="175" y2="498" stroke-width="2" stroke="white"/>
					</g>
				</svg>
				</PanZoom>
			</div>
			
		</div>
	);
}


function mapClick(evt){
	var e = evt.target;
	var dim = e.getBoundingClientRect();
	var x = evt.clientX - dim.left;
	var y = evt.clientY - dim.top;
	alert("x: "+x+" y:"+y);
}
export default Map;
