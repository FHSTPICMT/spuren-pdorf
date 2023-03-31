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
let playCount = 0;

navigator.geolocation.watchPosition(succesCallback, errorCallback, options);

//Get the current position
function succesCallback(pos)
{

  currentPos = pos.coords;
  UpdateHtmlText();
  if(hasStarted)
  {
    console.log("Successs");
    SearchTriggerPos();
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
    const posSplit = element.coord.split(',');
    //Berechnet die Distanz von der aktuellen Position zum Array Punkt
    distance = calculateDistance(currentPos.latitude, currentPos.longitude,parseFloat(posSplit[0]), parseFloat(posSplit[1]));
    
    if(distance <= searchRadius && element.name[0] != currentPoint)
    {
      console.log(currentPoint + " / " + element.name);
      currentPointTemp = element;
      pointCount++;
      console.log(currentPos);
      console.log(currentPointTemp);
    }
  }

  if(pointCount < 2 && pointCount != 0 && audio.paused)
  {
    currentPoint = currentPointTemp.name[0];
    const currentPosSplit = currentPointTemp.coord.split(',');
    currentDistance = calculateDistance(currentPos.latitude, currentPos.longitude,parseFloat(currentPosSplit[0]), parseFloat(currentPosSplit[1]));

    console.log(currentPointTemp.name.length);
    if(currentPointTemp.name.length <= 1 && !currentPointTemp.passed)
    {
      console.log("One");
      $.getScript("player.js",loadPosition(currentPointTemp.name[0]));
      currentPointTemp.passed = true;
    }
    else if(currentPointTemp.name.length > 1 && !currentPointTemp.passed)
    {
      console.log("Multi");
      $.getScript("player.js",loadPosition(currentPointTemp.name[0]));
      currentPointTemp.passed = true;
      
      audio.onended = function() {
        if(playCount < currentPointTemp.name.length-1)
        {
          playCount++;
          $.getScript("player.js",loadPosition(currentPointTemp.name[playCount]));
        } else
        {
          playCount = 0;
          audio.onended = null;
        }
      };
    } 
    else
    {
      console.log("Already passed.");
    }
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
  wakeLockSupported = true;
  document.getElementById("wakeText").innerHTML = wakeLockSupported;
}
else
{
  wakeLockSupported = false;
}

async function acquireLock(){
  wakeLock = await navigator.wakeLock.request("screen");
}

function releaseLock(){

}

function isPlaying(audelem) {
  return!audelem.paused;
}



