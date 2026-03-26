var NASA_KEY = "OwbV0ePzkKAlfWcjEvw6BwRBB2lwlEr9AAlIizDh";
var images = [];
var current = 0;

async function loadImages() {
  var dates = [];
  var today = new Date();

  for (var i = 0; i < 7; i++) {
    var d = new Date(today);
    d.setDate(today.getDate() - i);
    var yyyy = d.getFullYear();
    var mm = String(d.getMonth() + 1).padStart(2, "0");
    var dd = String(d.getDate()).padStart(2, "0");
    dates.push(yyyy + "-" + mm + "-" + dd);
  }

  for (var j = 0; j < dates.length; j++) {
    try {
      var res = await fetch("https://api.nasa.gov/planetary/apod?api_key=" + NASA_KEY + "&date=" + dates[j]);
      var data = await res.json();
      if (data.media_type === "image") {
        images.push({ url: data.url, title: data.title, credit: data.copyright || "" });
      }
    } catch (e) {}
  }

  if (images.length > 0) {
    showImage(0);
    setInterval(nextImage, 8000);
  }
}

function showImage(index) {
  var bg = document.getElementById("background");
  bg.style.transition = "none";
  bg.style.opacity = "0";

  setTimeout(function() {
    bg.style.backgroundImage = "url('" + images[index].url + "')";
    bg.style.transition = "opacity 1.2s ease";
    bg.style.opacity = "1";

    var credit = images[index].title;
    if (images[index].credit) credit += "  ©" + images[index].credit.trim();
    document.getElementById("apod-credit").innerText = "📡 " + credit;
  }, 300);
}

function nextImage() {
  current = (current + 1) % images.length;
  showImage(current);
}

function updateClock() {
  var now = new Date();
  var h = String(now.getHours()).padStart(2, "0");
  var m = String(now.getMinutes()).padStart(2, "0");
  var s = String(now.getSeconds()).padStart(2, "0");
  document.getElementById("time").innerText = h + ":" + m + ":" + s;
}

async function loadWeather(lat, lon) {
  var url = "https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + lon + "&current=temperature_2m,precipitation_probability,windspeed_10m&temperature_unit=celsius&windspeed_unit=kmh&timezone=auto";
  try {
    var res = await fetch(url);
    var data = await res.json();
    var c = data.current;
    document.getElementById("weather").innerText = Math.round(c.precipitation_probability) + "%  " + Math.round(c.temperature_2m) + "°C  " + Math.round(c.windspeed_10m) + " KM/H";
  } catch (e) {
    document.getElementById("weather").innerText = "weather unavailable";
  }
}

function askLocation() {
  if (!navigator.geolocation) {
    document.getElementById("weather").innerText = "no location";
    return;
  }
  navigator.geolocation.getCurrentPosition(
    function(pos) { loadWeather(pos.coords.latitude, pos.coords.longitude); },
    function() { document.getElementById("weather").innerText = "location denied"; }
  );
}

async function loadQuote() {
  try {
    var res = await fetch("https://api.quotable.io/random?maxLength=120");
    var data = await res.json();
    document.getElementById("quote-text").innerText = '"' + data.content + '"';
    document.getElementById("quote-author").innerText = "— " + data.author;
  } catch (e) {
    document.getElementById("quote-box").style.display = "none";
  }
}

updateClock();
setInterval(updateClock, 1000);

window.onload = function() {
  loadImages();
  askLocation();
  loadQuote();
};
