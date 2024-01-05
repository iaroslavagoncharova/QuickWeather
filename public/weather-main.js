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
  currentUnits = '°C';
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
        document.querySelector('.city').innerHTML = `${locality} (${city},  ${country})`;
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
}

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
    const currentTime = new Date().toISOString();
    try {
        const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,rain,showers,snowfall,relative_humidity_2m,wind_speed_10m&temperature_unit=${currentUnits}`;
        console.log(currentTime);
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
    }  catch (error) {
        console.log(error);
    }
} catch (error) {
    console.log(error);
}
}

navigator.geolocation.getCurrentPosition(success, error, positionOptions)


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


