import codes from "./weather-codes.js";

const unitsContainer = document.getElementById('units');
let currentUnits = '';

unitsContainer.addEventListener('change', (event) => {
  if (event.target.matches('.units')) {
    currentUnits = event.target.value;
    console.log(currentUnits);
    window.localStorage.setItem('units', currentUnits);
    window.location.reload();
  }
});


const themeColor = document.getElementById('theme-color');
let currentTheme = '';

themeColor.addEventListener('change', (event) => {
    if (event.target.matches('.theme-color')) {
        currentTheme = event.target.value;
        console.log(currentTheme);
        window.localStorage.setItem('theme', currentTheme);
        window.location.reload();
    }
    });

// setting a theme from local storage, if not present, setting light as default
const storedTheme = window.localStorage.getItem('theme');
const body = document.querySelector('body');

if (storedTheme) {
  currentTheme = storedTheme;
  console.log('Current value:', currentTheme);
    if (currentTheme === 'dark') {
        body.classList.add('dark');
    }
    else {
        body.classList.remove('dark');
    }
}
else {
    currentTheme = 'light';
    console.log('Current value:', currentTheme);
    body.classList.remove('dark');
    }
const theme = document.querySelectorAll('.theme-color');
theme.forEach((theme) => {
  if (theme.value === currentTheme) {
    theme.checked = true;
  }
});

// setting a unit from local storage, if not present, setting celsius as default
const storedUnits = window.localStorage.getItem('units');
if (storedUnits) {
  currentUnits = storedUnits;
  console.log('Current value:', currentUnits);
}
else {
  currentUnits = 'celsius';
  console.log('Current value:', currentUnits);
}
const units = document.querySelectorAll('.units');
units.forEach((unit) => {
  if (unit.value === currentUnits) {
    unit.checked = true;
  }
});

const getCity = async (lat, lon) => {
    const apiUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const data = await response.json();
        console.log(data);
        const city = data.city;
        const locality = data.locality;
        const country = data.countryName;
        document.querySelectorAll('.city').forEach((cityItem) => {
            cityItem.innerHTML = `${locality} (${city},  ${country})`;
        });
        window.localStorage.setItem('city', `${locality} (${city},  ${country})`);
        window.localStorage.setItem('lat', lat);
        window.localStorage.setItem('lon', lon);
        return data;
    } catch (error) {
        console.log(error);
    }
}

const updateWeather = (data) => {
    let temperature;
    if(data.current_units.temperature_2m === '°C') {
        temperature = `${data.current.temperature_2m} °C`;
    }
    else {
        temperature = `${data.current.temperature_2m} °F`;
    }
    const weatherCode = data.current.weather_code;
    const weatherDescription = codes[weatherCode];
    const rain = `${data.current.rain} mm`
    if (rain !== '0 mm') {
        const divResult = document.getElementById('weather-result');
        const divRain = document.createElement('div');
        divRain.innerHTML = `Rain: ${rain}`;
        divResult.appendChild(divRain);
    }
    const showers = `${data.current.showers} mm`
    if (showers !== '0 mm') {
        const divResult = document.getElementById('weather-result');
        const divShowers = document.createElement('div');
        divShowers.innerHTML = `Showers: ${showers}`;
        divResult.appendChild(divShowers);
    }
    const snowfall = `${data.current.snowfall} cm`
    if (snowfall !== '0 cm') {
        const divResult = document.getElementById('weather-result');
        const divSnowfall = document.createElement('div');
        divSnowfall.innerHTML = `Snowfall: ${snowfall}`;
        divResult.appendChild(divSnowfall);
    }
    const humidity = `${data.current.relative_humidity_2m} %`;
    let windSpeed;
    if(data.current_units.wind_speed_10m === 'km/h') {
        windSpeed =  `${data.current.wind_speed_10m} km/h`;
    } else {
        windSpeed =  `${data.current.wind_speed_10m} mph`;
    }
    const weatherDescriptionValue = document.querySelector('#weather-description-value');
    weatherDescriptionValue.innerHTML = weatherDescription;
    const temperatureValue = document.querySelector('#weather-temperature-value');
    temperatureValue.innerHTML = temperature;
    const humidityValue = document.querySelector('#weather-humidity-value');
    humidityValue.innerHTML = humidity;
    const windValue = document.querySelector('#weather-wind-value');
    windValue.innerHTML = windSpeed;

    const weatherIconClass = getWeatherIconClass(weatherCode);

    const weatherIconElement = document.getElementById('weather-icon-image');
    weatherIconElement.className = `fas ${weatherIconClass}`;
    weatherIconElement.setAttribute('aria-hidden', 'true');
}

const getWeatherIconClass = (weatherCode) => {
    // Define a mapping of weather codes to corresponding Font Awesome classes
    const iconMapping = {
        0: 'fa-sun',
        1: 'fa-sun',
        2: 'fa-cloud-sun',
        3: 'fa-cloud',
        45: 'fa-smog',
        48: 'fa-smog',
        51: 'fa-cloud-rain',
        53: 'fa-cloud-rain',
        55: 'fa-cloud-rain',
        56: 'fa-cloud-rain',
        57: 'fa-cloud-rain',
        61: 'fa-cloud-showers-heavy',
        63: 'fa-cloud-showers-heavy',
        65: 'fa-cloud-showers-heavy',
        66: 'fa-cloud-showers-heavy',
        67: 'fa-cloud-showers-heavy',
        71: 'fa-snowflake',
        73: 'fa-snowflake',
        75: 'fa-snowflake',
        77: 'fa-snowflake',
        80: 'fa-cloud-sun-rain',
        81: 'fa-cloud-sun-rain',
        82: 'fa-cloud-sun-rain',
        85: 'fa-cloud-snow',
        86: 'fa-cloud-snow',
        95: 'fa-bolt',
        96: 'fa-bolt',
        99: 'fa-bolt'
    };

    const defaultIcon = 'fa-question';
    const iconClass = iconMapping[weatherCode] || defaultIcon;

    return iconClass;
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
}

const getWeatherForLocation = async (lat, lon) => {
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,rain,showers,snowfall,relative_humidity_2m,wind_speed_10m&temperature_unit=${currentUnits}`;
    try {
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const result = await response.json();
        console.log(result);
        if (!response.ok) {
          throw new Error(result.error);
        }
        await getCity(lat, lon);
        updateWeather(result);
        showWeatherResult();
        console.log(currentUnits);
}  catch (error) {
    console.log(error);
    hideWeatherResult();
}
}

const customizationButton = document.querySelector('#customization-button');
// if a user clicks on the customization button, the settings div will be displayed, if it's already displayed, it will be hidden
customizationButton.addEventListener('click', () => {
    const settingsDiv = document.querySelector('#settings');
    if (settingsDiv.style.display === 'none') {
        settingsDiv.style.display = 'block';
    } else {
        settingsDiv.style.display = 'none';
    }
});

const weatherResult = document.querySelector('#weather-result');
const events = document.querySelector('#events');
const alertsNotifications = document.querySelector('#alerts-notifications');

const getWeather = () => {
    navigator.geolocation.getCurrentPosition(success, error, positionOptions);
    showWeatherResult();
}

const showWeatherResult = () => {
    weatherResult.style.display = 'block';
    events.style.display = 'block';
    alertsNotifications.style.display = 'block';
}

const hideWeatherResult = () => {
    weatherResult.style.display = 'none';
    events.style.display = 'none';
    alertsNotifications.style.display = 'none';
}

// get user's location when the link is clicked
const findLocation = document.querySelector('#find-location');
// showing weather result div

findLocation.addEventListener('click', () => {
    getWeather();
});

document.addEventListener('DOMContentLoaded', () => {
    // checking all set items in local storage and displaying
    hideWeatherResult();
    const storedCity = window.localStorage.getItem('city');
    const storedLat = window.localStorage.getItem('lat');
    const storedLon = window.localStorage.getItem('lon');
    if (storedLat !== null && storedLon !== null) {
        console.log(storedLat, storedLon);
        getWeatherForLocation(storedLat, storedLon);
    } else {
        hideWeatherResult();
    }
    if (storedCity) {
    document.querySelectorAll('.city').forEach((cityItem) => {
        cityItem.innerHTML = storedCity;
    });
    }
});

// adding functionality of finding weather for a city
const cityForm = document.querySelector('#city-search');
cityForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const city = document.querySelector('#city').value;
    console.log(city);
});

