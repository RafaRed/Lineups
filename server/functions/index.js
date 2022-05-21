const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const { initializeApp } = require("firebase-admin/app");
const responseTime = require("response-time");
var admin = require("firebase-admin");
var serviceAccount = require("./config.json");
const rateLimit = require("express-rate-limit");


admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://lineupsdb-default-rtdb.firebaseio.com",
});

//initializeApp();
var db = admin.database();

const app = express();
app.use(cors());
app.use(responseTime());
app.use(
	rateLimit({
		windowMs: 1 * 60 * 60 * 1000, // 12 hour duration in milliseconds
		max: 300,
		message: "You exceeded requests hour limit!",
		headers: true,
	})
);

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
});

app.post("/create-ud-account", (req, res) => {
	var _username = req.body.username.replace(".","*");
    console.log(_username)
    return new Promise((resolve, reject) => {
		var ref = db.ref("/users/"+_username);
		ref.once("value", function (snapshot) {
			var data = snapshot.val();

			if (data === null) {
                ref.set({
                    total_maps: 0,
                    timestamp: Date.now(),
                });
                console.log("user "+_username+" created.")
				
			} else {
				console.log("user "+_username+" logged in.")
			}
		});
	});
});

app.post("/create-map", (req, res) => {
    var _username = req.body.username.replace(".","*");
    var _agentName = req.body.agentName;
    var _mapName = req.body.mapName;
    var _pixels = req.body.pixels;
    var timestamp = Date.now();
    var ref = db.ref("/maps");
    const mapRef = ref.push();
    mapRef.set({username:_username,agentName:_agentName,mapName:_mapName,pixels:_pixels,creation_date:timestamp})
    var mapKey = mapRef.key;
    var usersRef = db.ref("/users/"+_username+"/maps/"+_mapName+"/"+_agentName+"/"+mapKey);
    usersRef.set({name:"undefined", timestamp:timestamp})
    res.json(mapKey);
});

app.post("/load-map", (req, res) => {

    var map_id = req.body.map_id;
    var ref = db.ref("/maps/"+map_id);
		ref.once("value", function (snapshot) {
			var data = snapshot.val();
            res.json(data)
		});
    
});

app.post("/load-maps", (req, res) => {
    var _username = req.body.username.replace(".","*");
    var ref = db.ref("/users/"+_username+"/maps");
		ref.once("value", function (snapshot) {
			var data = snapshot.val();
            res.json(data)
		});
    
});

app.post("/update-map", (req, res) => {
    var _username = req.body.username.replace(".","*");
    var _agentName = req.body.agentName;
    var _mapName = req.body.mapName;
    var _pixels = req.body.pixels;
    var _mapId = req.body.mapId;
    var timestamp = Date.now();

    var ref = db.ref("/maps/"+_mapId);
		ref.once("value", function (snapshot) {
			var data = snapshot.val();
            if(data.username===_username){
                var mapRef = db.ref("/maps/"+_mapId);
                mapRef.update({username:_username,agentName:_agentName,mapName:_mapName,pixels:_pixels,update_date:timestamp})
                res.json({status:"success"})
            }
		});
    

});


exports.app = functions.https.onRequest(app);