


var NASA_KEY = "OwbV0ePzkKAlfWcjEvw6BwRBB2lwlEr9AAlIizDh";


async function loadBackground() {
  var url = "https://api.nasa.gov/planetary/apod?api_key=" + NASA_KEY;

  try {
    var response = await fetch(url);
    if (!response.ok) throw new Error("nasa fetch failed: " + response.status);

    var data = await response.json();

    if (data.media_type != "image") {
      console.log("today apod is a video, cant use it");
      return;
    }

    document.getElementById("background").style.backgroundImage = "url('" + data.url + "')";

    if (data.copyright) {
      document.getElementById("apod-credit").innerText = "📡 " + data.title + "  ©" + data.copyright.trim();
    } else {
      document.getElementById("apod-credit").innerText = "📡 " + data.title;
    }

  } catch (err) {
    console.log("background error:", err.message);
  }
}


function updateClock() {
  var now = new Date();

  var h = String(now.getHours()).padStart(2, "0");
  var m = String(now.getMinutes()).padStart(2, "0");
  var s = String(now.getSeconds()).padStart(2, "0");

  document.getElementById("time").innerText = h + ":" + m + ":" + s;
}

updateClock();
setInterval(updateClock, 1000);


async function loadWeather(lat, lon) {
  var url = "https://api.open-meteo.com/v1/forecast"
    + "?latitude=" + lat
    + "&longitude=" + lon
    + "&current=temperature_2m,precipitation_probability,windspeed_10m"
    + "&temperature_unit=celsius&windspeed_unit=kmh&timezone=auto";

  try {
    var response = await fetch(url);
    if (!response.ok) throw new Error("weather fetch failed");

    var data = await response.json();
    var c = data.current;

    var temp = Math.round(c.temperature_2m);
    var rain = c.precipitation_probability;
    var wind = Math.round(c.windspeed_10m);

    document.getElementById("weather").innerText = rain + "%  " + temp + "°C  " + wind + " KM/H";

  } catch (err) {
    console.log("weather error:", err.message);
    document.getElementById("weather").innerText = "weather unavailable";
  }
}

function askLocation() {
  if (!navigator.geolocation) {
    document.getElementById("weather").innerText = "no location access";
    return;
  }

  navigator.geolocation.getCurrentPosition(
    function(pos) {
      loadWeather(pos.coords.latitude, pos.coords.longitude);
    },
    function() {
      document.getElementById("weather").innerText = "location denied";
    }
  );
}


async function loadQuote() {
  try {
    var response = await fetch("https://api.quotable.io/random?maxLength=120");
    if (!response.ok) throw new Error("quote fetch failed");

    var data = await response.json();

    document.getElementById("quote-text").innerText = '"' + data.content + '"';
    document.getElementById("quote-author").innerText = "— " + data.author;

  } catch (err) {
    
    console.log("quote error:", err.message);
    document.getElementById("quote-box").style.display = "none";
  }
}


window.onload = function() {
  loadBackground();
  askLocation();
  loadQuote();
};
