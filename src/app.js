function formatDate(date) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  let hours = date.getHours();
  let minutes = date.getMinutes();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return day + ", " + hours + ":" + minutes;
}

function formatDay(timestamp) {
  let date = new Date((timestamp + 24 * 60 * 60) * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

function displayForecast(response) {
  let forecastElement = document.querySelector("#forecast");

  let forecast = response.data.daily;

  let forecastHTML = `<div class="row justify-content-center">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        ` 
    <div class="card col-2">
        <ul class="card-body">
          <li class="weather-forecast-date">${formatDay(forecastDay.dt)}</li>
          <img src="http://openweathermap.org/img/wn/${
            forecastDay.weather[0].icon
          }@2x.png" width="50" class="forecast-img" />
          <li class="weather-forecast-temperatures"><span class="weather-forecast-temperature-min">${Math.round(
            forecastDay.temp.min
          )}°C</span> - <span
              class="weather-forecast-temperature-max">${Math.round(
                forecastDay.temp.max
              )}°C</span></li>
        </ul>
      </div>
  `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  console.log(coordinates);
  let apiKey = "adb83e4d70913c89c01ae1ae9eaf5a39";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function displayWeatherCondition(response) {
  let today = document.querySelector("#date");
  let now = new Date();
  today.innerHTML = formatDate(
    new Date(
      now.valueOf() +
        now.getTimezoneOffset() * 60000 +
        response.data.timezone * 1000
    )
  );
  document.querySelector("#city").innerHTML = response.data.name;
  document.querySelector("#speed").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#description").innerHTML =
    response.data.weather[0].description;

  document.querySelector("#temperature").innerHTML = Math.round(
    response.data.main.temp
  );
  let iconElement = document.querySelector(".icon");
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  getForecast(response.data.coord);
}

function retrievePosition(position) {
  allowCity.classList.add("enable");
  let buttonDesription = document.querySelector("#allow-button");
  buttonDesription.innerHTML = "Location allowed";
  let apiKey = "adb83e4d70913c89c01ae1ae9eaf5a39";
  let lon = position.coords.longitude;
  let lat = position.coords.latitude;
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  axios.get(url).then(displayWeatherCondition);
}
function allowPosition() {
  navigator.geolocation.getCurrentPosition(retrievePosition);
}

function searchCity(city) {
  let apiKey = "adb83e4d70913c89c01ae1ae9eaf5a39";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeatherCondition);
}

function handleSubmit(event) {
  event.preventDefault();
  let buttonDesription = document.querySelector("#allow-button");
  allowCity.classList.remove("enable");
  buttonDesription.innerHTML = `Allow your location <i class="fa-solid fa-map-pin"></i>`;
  let city = document.querySelector("#city-input").value;
  searchCity(city);
}
function convertToFahrenheit(event) {
  event.preventDefault();
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let temperatureElement = document.querySelector("#temperature");
  let fahrenheitTemperature = (temperatureElement.innerHTML * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
}

function convertToCelsius(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(
    ((temperatureElement.innerHTML - 32) * 5) / 9
  );
}

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", convertToFahrenheit);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", convertToCelsius);

let allowCity = document.querySelector("#allow-button");
allowCity.addEventListener("click", allowPosition);

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleSubmit);

searchCity("Kyiv");
