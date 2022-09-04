const key = "53e0a124721155baf6d87c5dd3a1f988";
const loaded = document.getElementById("loaded");
const loading = document.getElementById("Loading");
const search = document.getElementById("search-icon");
const error = document.getElementById("error");

// Change Search Icon To Gif In Mouse Enter Event
search.addEventListener("mouseenter", () => {
  search.src = "./static/images/icons8-search.gif";
});

// Change Search Icon To Png In Mouse Leave Event
search.addEventListener("mouseleave", () => {
  search.src = "./static/images/icons8-search-48.png";
});

// Search Icon Click And  Call GetCityWeather(city) To Get Weather Data
search.addEventListener("click", () => {
  let city = document.getElementById("search-input").value;
  GetCityWeather(city);
});

// Get User Location When Page Is Loaded
window.addEventListener("load", () => {
  navigator.geolocation.getCurrentPosition(setLocation, (e) =>
    GetCityWeather("Tehran", true)
  );
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
// Fetch Api With City Name
async function GetCityWeather(city, first = false) {
  loading.classList.toggle("active");
  loaded.classList.toggle("active");
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${key}`;
  let result = await fetch(url);
  if (!result.ok) {
    // Display Error When City Not Found
    loaded.innerHTML = "";
    console.log(result);
    error.innerHTML = result.status + ": Somthing Wrong";
    error.classList.toggle("active");
    loading.classList.toggle("active");
    loaded.classList.toggle("active");
    setTimeout(() => {
      error.classList.toggle("active");
    }, 5000);
  } else SetDataToUI(await result.json(), first);
}
// Add Weather Data To Ui .loaded class
function SetDataToUI(weatherData, first = false) {
  let temp = Math.floor(weatherData.main.temp);
  let html = `<div class="header">
                  <h4 class="city-name">${weatherData.sys.country} / ${weatherData.name}</h4>
              </div>
              <div class="body">
                  <img src="http://openweathermap.org/img/wn/${
                    weatherData.weather[0].icon
                  }@2x.png"  class="current-weather-icon" />
                  <h5 class="current-weather-text">${
                    weatherData.weather[0].description
                  }</h5>
              </div>
              <div class="footer">
                  <div class="data">
                      <img src="${
                        temp >= 20
                          ? "./static/images/hot.png"
                          : "./static/images/freezing.png"
                      }" class="current-data-icon" alt="">
                      <h4 class="current-data-text">${temp} C</h4>
                      <span>Temperature</span>
                  </div>
                  <div class="data">
                      <img src="./static/images/wind.png" class="current-data-icon" alt="">
                      <h4 class="current-data-text">${
                        weatherData.wind.speed
                      } KM</h4>
                      <span>Wind</span>
                  </div>
                  <div class="data">
                      <img src="./static/images/humidity.png" class="current-data-icon" alt="">
                      <h4 class="current-data-text">${
                        weatherData.main.humidity
                      } %</h4>
                      <span>Humidity</span>
                  </div>
                  <div class="data">
                      <img src="./static/images/clouds.png" class="current-data-icon" alt="">
                      <h4 class="current-data-text">${
                        weatherData.clouds.all
                      } %</h4>
                      <span>Clouds</span>
                  </div>
              </div>`;
  loaded.innerHTML = html;
  if (!first) {
    loaded.classList.toggle("active");
    loading.classList.toggle("active");
  }
}
