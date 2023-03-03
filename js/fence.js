let options;
let currentPos;
let currentPoint;
let currentDistance;
let pointCount = 0;
let searchRadius = 0.02;
let hasStarted = false;
let wakeLock = null;
let wakeLockSupported = false;
let changeCount = 0;

//Array 
//mit Positions Name / Latitude, Longitude / Video, Bild Link
const posArray =   
[
  {name:"01_Die_Ortsansaessigen", lat: 48.200171, long: 15.607446, cover:1},
  {name:"02_Steinbruch_Ort", lat: 48.200226, long: 15.606874, cover:2}, 
  {name:"03_Verladestation", lat: 48.200562, long: 15.606617, cover:3}, 
  {name:"04_Das_Lager", lat: 48.200921, long: 15.606440, cover:4}, 
  {name:"05_Die_Ortschaften", lat: 48.201282, long: 15.606295, cover:5}, 
  {name:"06_Die_Kirche", lat: 48.201499, long: 15.605828, cover:6}, 
  {name:"07_Die_Einfahrt", lat: 48.201508, long: 15.605259, cover:7}, 
  {name:"08_Die_Wirtschaft", lat: 48.201856, long: 15.605023, cover:8}, 
  {name:"09_Die_Kollegen", lat: 48.202217, long: 15.604841, cover:9}, 
  {name:"10_Das_Spalten", lat: 48.202585, long: 15.604664, cover:10},
  {name:"11_Der_Baron", lat: 48.202837, long: 15.605105, cover:11},
  {name:"12_Die_Betriebsbaracke", lat: 48.203141, long: 15.606164, cover:12},
  {name:"13_Das_Ziegelwerk", lat: 48.203315, long: 15.606677, cover:13},
  {name:"14_Das_Waechterhaus", lat: 48.203478, long: 15.607211, cover:14}
];

navigator.geolocation.watchPosition(succesCallback, errorCallback, options);

//Get the current position
function succesCallback(pos)
{
  if(hasStarted)
  {
    currentPos = pos.coords;
    SearchTriggerPos();
    UpdateHtmlText();
  }
}

//Called if an error appears
function errorCallback(error)
{
  console.log(error);
}

options = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 0
};

function SearchTriggerPos()
{
  changeCount++;
  let currentPointTemp;

  //Geht durch das posArray
  for (let index = 0; index < posArray.length; index++) {
    const element = posArray[index];
    
    //Berechnet die Distanz von der aktuellen Position zum Array Punkt
    distance = calculateDistance(currentPos.latitude, currentPos.longitude,element.lat, element.long);
    console.log(distance);

    if(distance <= searchRadius && element.name != currentPoint)
    {
      currentPointTemp = element;
      pointCount++;
    }
  }

  if(pointCount < 2 && pointCount != 0 )
  {
    currentPoint = currentPointTemp.name;
    console.log(currentPointTemp);
    currentDistance = calculateDistance(currentPos.latitude, currentPos.longitude,currentPointTemp.lat, currentPointTemp.long);
    $.getScript("player.js",loadPosition(currentPoint));
    document.getElementById("pointCountText").innerHTML = "Point Count: " + pointCount + "Change Count: " + changeCount;
  }
  else
  {
    document.getElementById("pointCountText").innerHTML = "Point Count: " + pointCount + "Change Count: " + changeCount;
  }

  pointCount = 0;
}

//Aktualisiert den Html Text
function UpdateHtmlText(){
      $("#currentLat").text(currentPos.latitude);
      $("#currentLon").text(currentPos.longitude);
      $("#accuracyText").text(currentPos.accuracy);
      $("#distance").text(currentDistance);
}

// Reused code - copyright Moveable Type Scripts - retrieved May 4, 2010.
// http://www.movable-type.co.uk/scripts/latlong.html
// Under Creative Commons License http://creativecommons.org/licenses/by/3.0/
function calculateDistance(lat1, lon1, lat2, lon2)
{
  var R = 6371; // km
  var dLat = (lat2-lat1).toRad();
  var dLon = (lon2-lon1).toRad();
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
          Math.sin(dLon/2) * Math.sin(dLon/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c;
  return d;
}

Number.prototype.toRad = function()
{
  return this * Math.PI / 180;
}

function ToggleDebug() {
  var x = document.getElementById("debug");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

if('wakeLock' in navigator)
{
  console.log("WakeLock Supported.");
  wakeLockSupported = true;
  document.getElementById("wakeText").innerHTML = wakeLockSupported;
}
else
{
  console.log("WakeLock not Supported.");
  wakeLockSupported = false;
}

async function acquireLock(){
  wakeLock = await navigator.wakeLock.request("screen");
  console.log("WakeLock activated.");
}

function releaseLock(){

}



