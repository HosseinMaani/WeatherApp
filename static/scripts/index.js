const key = "53e0a124721155baf6d87c5dd3a1f988";
const loaded = document.getElementById("loaded");
const loading = document.getElementById("Loading");
const search = document.getElementById("search-icon");
const error = document.getElementById("error");

search.addEventListener("mouseenter", () => {
  search.src = "./static/images/icons8-search.gif";
});
search.addEventListener("mouseleave", () => {
  search.src = "./static/images/icons8-search-48.png";
});
search.addEventListener("click", () => {
  let city = document.getElementById("search-input").value;
  GetCityWeather(city);
});

window.addEventListener("load", () => {
  if (navigator.geolocation)
    navigator.geolocation.getCurrentPosition(setLocation, () =>
      GetCityWeather("London")
    );
  else GetCityWeather("London");
});

// Set Weather With Geo Location
async function setLocation(loc) {
  await GetLocationWithGeo(loc.coords.latitude, loc.coords.longitude);
}

// Fetch Api With Geo Location
async function GetLocationWithGeo(lat, lon) {
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${key}`;
  let result = await fetch(url);
  SetDataToUI(await result.json());
}

async function GetCityWeather(city) {
  loading.classList.toggle("active");
  loaded.classList.toggle("active");
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${key}`;
  let result = await fetch(url);
  if (!result.ok) {
    loaded.innerHTML = "";
    console.log(result);
    error.innerHTML = result.status + ": Somthing Wrong";
    error.classList.toggle("active");
    loading.classList.toggle("active");
    loaded.classList.toggle("active");
    setTimeout(() => {
      error.classList.toggle("active");
    }, 5000);
  } else SetDataToUI(await result.json());
}

function SetDataToUI(weatherData) {
  console.log(weatherData);
  let temp = Math.floor(weatherData.main.temp);
  let html = `<div class="header">
    <h4 class="city-name">${weatherData.sys.country} / ${weatherData.name}</h4>
</div>
<div class="body">
    <img src="http://openweathermap.org/img/wn/${
      weatherData.weather[0].icon
    }@2x.png"  class="current-weather-icon" />
    <h5 class="current-weather-text">${weatherData.weather[0].description}</h5>
</div>
<div class="footer">
    <div class="data">
        <img src="${
          temp >= 20
            ? "./static/images/hot.png"
            : "./static/images/freezing.png"
        }" class="current-data-icon" alt="">
        <h4 class="current-data-text">${temp} C</h4>
    </div>
    <div class="data">
        <img src="./static/images/wind.png" class="current-data-icon" alt="">
        <h4 class="current-data-text">${weatherData.wind.speed} KM</h4>
    </div>
</div>`;
  loaded.innerHTML = html;
  loaded.classList.toggle("active");
  loading.classList.toggle("active");
}
