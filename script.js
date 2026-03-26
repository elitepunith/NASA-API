// ---- background from NASA ----
async function getBackground() {
  const url = "OwbV0ePzkKAlfWcjEvw6BwRBB2lwlEr9AAlIizDh";

  try {
    const response = await fetch(url);
    const result = await response.json();

    if (result.media_type === "image") {
      document.getElementById("background").style.backgroundImage = `url('${result.url}')`;
    }

  } catch (error) {
    console.log(error);
  }
}


function updateTime() {
  const now = new Date();

  let h = String(now.getHours()).padStart(2, "0");
  let m = String(now.getMinutes()).padStart(2, "0");
  let s = String(now.getSeconds()).padStart(2, "0");

  document.getElementById("time").innerText = `${h}:${m}:${s}`;
}

setInterval(updateTime, 1000);

async function getWeather(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,windspeed_10m`;

  try {
    const response = await fetch(url);
    const result = await response.json();

    const temp = result.current.temperature_2m;
    const wind = result.current.windspeed_10m;

    document.getElementById("weather").innerText = `${temp}°C  |  ${wind} km/h wind`;

  } catch (error) {
    console.log(error);
  }
}

function askLocation() {
  navigator.geolocation.getCurrentPosition(function(pos) {
    getWeather(pos.coords.latitude, pos.coords.longitude);
  });
}


window.onload = function() {
  getBackground();
  updateTime();
  askLocation();
};
