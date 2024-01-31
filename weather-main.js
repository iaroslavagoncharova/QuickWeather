import codes from "./weather-codes.js";
import getWeatherIconClass from "./weather-icons.js";

const unitsContainer = document.getElementById("units");
let currentUnits = "";

unitsContainer.addEventListener("change", (event) => {
  if (event.target.matches(".units")) {
    currentUnits = event.target.value;
    console.log(currentUnits);
    window.localStorage.setItem("units", currentUnits);
    window.location.reload();
  }
});

const themeColor = document.getElementById("theme-color");
let currentTheme = "";

themeColor.addEventListener("change", (event) => {
  if (event.target.matches(".theme-color")) {
    currentTheme = event.target.value;
    console.log(currentTheme);
    updateTheme(currentTheme);
  }
});

// function to update the theme based on user preference
function updateTheme(theme) {
  window.localStorage.setItem("theme", theme);
  updateThemeClasses();
  window.location.reload();
}

// function to set the theme based on local storage or default to light
function setTheme() {
  let storedTheme = window.localStorage.getItem("theme");

  if (storedTheme) {
    console.log("Current value:", storedTheme);
  } else {
    storedTheme = "light";
    console.log("Default value:", storedTheme);
    window.localStorage.setItem("theme", storedTheme);
  }

  updateThemeClasses();
}

// function to update theme classes based on dark mode conditions
function updateThemeClasses() {
  const body = document.querySelector("body");
  const currentHour = new Date().getHours();
  const darkModeStartHour = 18;
  const darkModeEndHour = 6;
  const currentStoredTheme = window.localStorage.getItem("theme");

  // check if a user has manually chosen a theme
  if (currentStoredTheme === "dark" || currentStoredTheme === "light") {
    body.classList.toggle("dark", currentStoredTheme === "dark");
  } else {
    // if not, set the theme based on time
    body.classList.toggle(
      "dark",
      currentHour >= darkModeStartHour || currentHour < darkModeEndHour
    );
  }

  // set the checked state for the theme color radio buttons
  const theme = document.querySelectorAll(".theme-color");
  theme.forEach((theme) => {
    if (theme.value === currentStoredTheme) {
      theme.checked = true;
    }
  });
}

// initialize the theme
setTheme();

// setting a unit from local storage, if not present, setting celsius as default
const storedUnits = window.localStorage.getItem("units");
if (storedUnits) {
  currentUnits = storedUnits;
  console.log("Current value:", currentUnits);
} else {
  currentUnits = "celsius";
  console.log("Current value:", currentUnits);
}
const units = document.querySelectorAll(".units");
units.forEach((unit) => {
  if (unit.value === currentUnits) {
    unit.checked = true;
  }
});

// function to get a city name based on user's location
const getCity = async (lat, lon) => {
  const apiUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log(data);
    const city = data.city;
    const locality = data.locality;
    const country = data.countryName;
    document.querySelectorAll(".city").forEach((cityItem) => {
      cityItem.innerHTML = `${locality} (${city},  ${country})`;
    });
    window.localStorage.setItem("city", `${locality} (${city},  ${country})`);
    window.localStorage.setItem("lat", lat);
    window.localStorage.setItem("lon", lon);
    return data;
  } catch (error) {
    console.log(error);
  }
};

// function to update all weather parameters
const updateWeather = (data) => {
  let temperature;
  if (data.current_units.temperature_2m === "°C") {
    temperature = `${data.current.temperature_2m} °C`;
  } else {
    temperature = `${data.current.temperature_2m} °F`;
  }
  const weatherCode = data.current.weather_code;
  const weatherDescription = codes[weatherCode];
  const rain = `${data.current.rain} mm`;
  if (rain !== "0 mm") {
    const spanRain = document.getElementById("weather-rain-value");
    spanRain.innerHTML = rain;
  } else {
    const divRain = document.getElementById("weather-rain");
    divRain.style.display = "none";
  }
  const showers = `${data.current.showers} mm`;
  if (showers !== "0 mm") {
    const spanShowers = document.getElementById("weather-showers-value");
    spanShowers.innerHTML = showers;
  } else {
    const divShowers = document.getElementById("weather-showers");
    divShowers.style.display = "none";
  }
  const snowfall = `${data.current.snowfall} cm`;
  if (snowfall !== "0 cm") {
    const spanSnowfall = document.getElementById("weather-snowfall-value");
    spanSnowfall.innerHTML = snowfall;
  } else {
    const divSnowfall = document.getElementById("weather-snowfall");
    divSnowfall.style.display = "none";
  }
  const humidity = `${data.current.relative_humidity_2m} %`;
  let windSpeed;
  if (data.current_units.wind_speed_10m === "km/h") {
    windSpeed = `${data.current.wind_speed_10m} km/h`;
  } else {
    windSpeed = `${data.current.wind_speed_10m} mph`;
  }
  const weatherDescriptionValue = document.querySelector(
    "#weather-description-value"
  );
  weatherDescriptionValue.innerHTML = weatherDescription;
  const temperatureValue = document.querySelector("#weather-temperature-value");
  temperatureValue.innerHTML = temperature;
  const humidityValue = document.querySelector("#weather-humidity-value");
  humidityValue.innerHTML = humidity;
  const windValue = document.querySelector("#weather-wind-value");
  windValue.innerHTML = windSpeed;

  const weatherIconClass = getWeatherIconClass(weatherCode);

  const weatherIconDiv = document.getElementById("weather-icon");
  weatherIconDiv.innerHTML = `<img src="${weatherIconClass}" alt="weather icon">`;

  const weatherForecast = document.getElementById("forecast");
  weatherForecast.innerHTML = "";
};

const getWeekDay = (date) => {
  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let weekDay = [];
  date.forEach((dates) => {
    const dateObj = new Date(dates);
    const dayOfWeek = weekDays[dateObj.getDay()];
    weekDay.push(dayOfWeek);
  });
  return weekDay;
};

// function to update seven day forecast after getting a city name
const updateSevenDayForecast = (data) => {
  const weatherCodes = data.daily.weather_code;
  const weatherDescriptions = [];
  weatherCodes.forEach((code) => {
    weatherDescriptions.push(codes[code]);
  });
  const weatherIcons = [];
  weatherCodes.forEach((code) => {
    weatherIcons.push(getWeatherIconClass(code));
  });
  const weatherTemperaturesMax = data.daily.temperature_2m_max;
  const weatherTemperaturesMin = data.daily.temperature_2m_min;
  const weatherRain = data.daily.rain_sum;
  const weatherShowers = data.daily.showers_sum;
  const weatherSnowfall = data.daily.snowfall_sum;
  const weatherWindSpeed = data.daily.wind_speed_10m_max;
  const weatherForecastDiv = document.getElementById("forecast");
  const weatherForecast = [];
  const date = data.daily.time;
  // creating divs for each day
  for (let i = 0; i < 7; i++) {
    const div = document.createElement("div");
    div.classList.add("forecast-item");
    weatherForecastDiv.appendChild(div);
    weatherForecast.push(div);
  }
  // adding week days
  const weekDays = getWeekDay(date);
  const weatherWeekDayDivs = [];
  weekDays.forEach((day) => {
    const div = document.createElement("div");
    div.classList.add("weather-week-day");
    weatherWeekDayDivs.push(div);
  });
  weatherForecast.forEach((div, index) => {
    div.appendChild(weatherWeekDayDivs[index]);
  });
  weatherWeekDayDivs.forEach((div, index) => {
    div.innerHTML = weekDays[index];
  });
  // adding weather icons
  const weatherIconDivs = [];
  weatherIcons.forEach((icon) => {
    const div = document.createElement("div");
    div.classList.add("weather-icon");
    weatherIconDivs.push(div);
  });
  weatherForecast.forEach((div, index) => {
    div.appendChild(weatherIconDivs[index]);
  });
  weatherIconDivs.forEach((div, index) => {
    div.innerHTML = `<img src="${weatherIcons[index]}" alt="weather icon">`;
  });
  // adding weather descriptions
  const weatherDescriptionDivs = [];
  weatherDescriptions.forEach((description) => {
    const div = document.createElement("div");
    div.classList.add("weather-description");
    weatherDescriptionDivs.push(div);
  });
  weatherForecast.forEach((div, index) => {
    div.appendChild(weatherDescriptionDivs[index]);
  });
  weatherDescriptionDivs.forEach((div, index) => {
    div.innerHTML = weatherDescriptions[index];
  });
  // adding temperatures
  const weatherTemperatureMaxDivs = [];
  weatherTemperaturesMax.forEach((temperature) => {
    const div = document.createElement("div");
    div.classList.add("weather-temperature");
    weatherTemperatureMaxDivs.push(div);
  });
  weatherForecast.forEach((div, index) => {
    div.appendChild(weatherTemperatureMaxDivs[index]);
  });
  weatherTemperatureMaxDivs.forEach((div, index) => {
    div.innerHTML = `Max. ${weatherTemperaturesMax[index]} ${
      currentUnits === "celsius" ? "°C" : "°F"
    }`;
  });
  const weatherTemperatureMinDivs = [];
  weatherTemperaturesMin.forEach((temperature) => {
    const div = document.createElement("div");
    div.classList.add("weather-temperature");
    weatherTemperatureMinDivs.push(div);
  });
  weatherForecast.forEach((div, index) => {
    div.appendChild(weatherTemperatureMinDivs[index]);
  });
  weatherTemperatureMinDivs.forEach((div, index) => {
    div.innerHTML = `Min. ${weatherTemperaturesMin[index]} ${
      currentUnits === "celsius" ? "°C" : "°F"
    }`;
  });
  // adding rain
  const weatherRainDivs = [];
  weatherRain.forEach((rain) => {
    const div = document.createElement("div");
    div.classList.add("weather-rain");
    weatherRainDivs.push(div);
  });
  weatherForecast.forEach((div, index) => {
    div.appendChild(weatherRainDivs[index]);
  });
  weatherRainDivs.forEach((div, index) => {
    const i = document.createElement("i");
    i.classList.add("fas", "fa-cloud-rain");
    div.appendChild(i);
    div.innerHTML += ` ${weatherRain[index]} mm`;
  });
  if (weatherRain.every((rain) => rain === 0)) {
    weatherRainDivs.forEach((div) => {
      div.style.display = "none";
    });
  }
  // adding showers
  const weatherShowersDivs = [];
  weatherShowers.forEach((showers) => {
    const div = document.createElement("div");
    div.classList.add("weather-showers");
    weatherShowersDivs.push(div);
  });
  weatherForecast.forEach((div, index) => {
    div.appendChild(weatherShowersDivs[index]);
  });
  weatherShowersDivs.forEach((div, index) => {
    const i = document.createElement("i");
    i.classList.add("fas", "fa-cloud-showers-heavy");
    div.appendChild(i);
    div.innerHTML += ` ${weatherShowers[index]} mm`;
  });

  // adding snowfall
  const weatherSnowfallDivs = [];
  weatherSnowfall.forEach((snowfall) => {
    const div = document.createElement("div");
    div.classList.add("weather-snowfall");
    weatherSnowfallDivs.push(div);
  });
  weatherForecast.forEach((div, index) => {
    div.appendChild(weatherSnowfallDivs[index]);
  });
  weatherSnowfallDivs.forEach((div, index) => {
    const i = document.createElement("i");
    i.classList.add("fas", "fa-snowflake");
    div.appendChild(i);
    div.innerHTML += ` ${weatherSnowfall[index]} cm`;
  });

  for (let day = 0; day < 7; day++) {
    if (weatherSnowfall[day] === 0) {
      weatherSnowfallDivs[day].style.display = "none";
    }
    if (weatherShowers[day] === 0) {
      weatherShowersDivs[day].style.display = "none";
    }
    if (weatherRain[day] === 0) {
      weatherRainDivs[day].style.display = "none";
    }
  }

  // adding wind speed
  const weatherWindSpeedDivs = [];
  weatherWindSpeed.forEach((windSpeed) => {
    const div = document.createElement("div");
    div.classList.add("weather-wind-speed");
    weatherWindSpeedDivs.push(div);
  });
  weatherForecast.forEach((div, index) => {
    div.appendChild(weatherWindSpeedDivs[index]);
  });
  weatherWindSpeedDivs.forEach((div, index) => {
    const i = document.createElement("i");
    i.classList.add("fas", "fa-wind");
    div.appendChild(i);
    div.innerHTML += ` ${weatherWindSpeed[index]} km/h`;
  });
};

const positionOptions = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

const error = (GeolocationPositionError) => {
  console.warn(`ERROR(${err.code}): ${err.message}`);
};

const success = async (position) => {
  const crd = position.coords;
  console.log(crd.latitude, crd.longitude);
  const lat = crd.latitude;
  const lon = crd.longitude;
  try {
    await getWeatherForLocation(lat, lon);
  } catch (error) {
    console.log(error);
  }
};

// function to get seven day forecast for a location
const getSevenDayForecast = async (lat, lon) => {
  const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_probability_max,wind_speed_10m_max&temperature_unit=${currentUnits}`;
  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    console.log(result);
    if (!response.ok) {
      throw new Error(result.error);
    }
    updateSevenDayForecast(result);
  } catch (error) {
    console.log(error);
  }
};

// function to get weather alerts for a location
const weatherAlerts = document.querySelector("#weather-alerts");
const getWeatherAlerts = async (lat, lon) => {
  weatherAlerts.innerHTML = "";
  const alertsUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat}%2C%20${lon}?unitGroup=metric&key=C6SJY5292AMUV379DWE5QCUCY&contentType=json`;
  try {
    const response = await fetch(alertsUrl, {
      method: "GET",
    });
    const data = await response.json();
    console.log(data);
    if (!response.ok) {
      throw new Error(data.error);
    }
    const alerts = data.alerts;
    if (alerts.length !== 0) {
      alerts.forEach((alert) => {
        const alertDiv = document.createElement("div");
        alertDiv.classList.add("alert");
        weatherAlerts.appendChild(alertDiv);
        const alertTitle = document.createElement("h3");
        alertTitle.classList.add("alert-title");
        alertDiv.appendChild(alertTitle);
        alertTitle.innerHTML = alert.event;
        const alertDescription = document.createElement("p");
        alertDescription.classList.add("alert-description");
        alertDiv.appendChild(alertDescription);
        alertDescription.innerHTML = alert.description;
      });
    } else {
      const noAlerts = document.createElement("p");
      noAlerts.classList.add("no-alerts");
      weatherAlerts.appendChild(noAlerts);
      noAlerts.innerHTML = "No alerts for this location";
    }
  } catch (error) {
    console.log(error);
  }
};

// function to get weather for a location (lat, lon) and call all functions to update weather parameters
const getWeatherForLocation = async (lat, lon) => {
  const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,rain,showers,snowfall,relative_humidity_2m,wind_speed_10m&temperature_unit=${currentUnits}`;
  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    console.log(result);
    if (!response.ok) {
      throw new Error(result.error);
    }
    await getCity(lat, lon);
    updateWeather(result);
    showWeatherResult();
    getSevenDayForecast(lat, lon);
    getWeatherAlerts(lat, lon);
    console.log(currentUnits);
  } catch (error) {
    console.log(error);
    hideWeatherResult();
  }
};

const customizationButton = document.querySelector("#customization-button");
// if a user clicks on the customization button, the settings div will be displayed, if it's already displayed, it will be hidden
customizationButton.addEventListener("click", (event) => {
  event.stopPropagation();
  const settingsDiv = document.querySelector("#settings");
  if (settingsDiv.style.display === "none") {
    settingsDiv.style.display = "block";
  } else {
    settingsDiv.style.display = "none";
  }
});

document.addEventListener("click", (event) => {
  if (
    !event.target.closest("#settings") &&
    !event.target.matches("#customization-button")
  ) {
    const settingsDiv = document.querySelector("#settings");
    settingsDiv.style.display = "none";
  }
});

const weatherResult = document.querySelector("#weather-result");

const getWeather = () => {
  navigator.geolocation.getCurrentPosition(success, error, positionOptions);
  showWeatherResult();
};

const showWeatherResult = () => {
  weatherResult.style.display = "flex";
};

const hideWeatherResult = () => {
  weatherResult.style.display = "none";
};

// get user's location when the link is clicked
const findLocation = document.querySelector("#find-location");
// showing weather result div

findLocation.addEventListener("click", () => {
  getWeather();
});

document.addEventListener("DOMContentLoaded", () => {
  // checking all set items in local storage and displaying
  hideWeatherResult();
  const storedCity = window.localStorage.getItem("city");
  const storedLat = window.localStorage.getItem("lat");
  const storedLon = window.localStorage.getItem("lon");
  if (storedLat !== null && storedLon !== null) {
    console.log(storedLat, storedLon);
    getWeatherForLocation(storedLat, storedLon);
  } else {
    hideWeatherResult();
  }
  if (storedCity) {
    document.querySelectorAll(".city").forEach((cityItem) => {
      cityItem.innerHTML = storedCity;
    });
  }
});

const getCityByName = async (city) => {
  const apiKey = "659fba3dc1b9b387846272lps4b1634";
  const api = `https://geocode.maps.co/search?q=${city}&api_key=${apiKey}`;
  try {
    const response = await fetch(api, {
      method: "GET",
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error);
    }
    console.log(data);
    const lat = data[0].lat;
    const lon = data[0].lon;
    console.log(lat, lon);
    await getWeatherForLocation(lat, lon);
    return data;
  } catch (error) {
    console.log(error);
  }
};

// adding functionality of finding weather for a city
const cityForm = document.querySelector("#city-search");
cityForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const city = document.querySelector("#city").value;
  document.querySelector("#city").value = "";
  city.trim();
  console.log(city);
  getCityByName(city);
});
