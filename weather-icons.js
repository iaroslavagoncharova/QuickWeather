const getWeatherIconClass = (weatherCode) => {
    // Define a mapping of weather codes to corresponding images
    const weatherIcons = {
        0: 'images/sun.png',
        1: 'images/sun.png',
        2: 'images/sun-cloud.png',
        3: 'images/clouds.png',
        45: 'images/fog.png',
        48: 'images/fog.png',
        51: 'images/cloud-rain.png',
        53: 'images/cloud-rain.png',
        55: 'images/cloud-rain.png',
        56: 'images/cloud-rain.png',
        57: 'images/cloud-rain.png',
        61: 'images/heavy-rain.png',
        63: 'images/heavy-rain.png',
        65: 'images/heavy-rain.png',
        66: 'images/heavy-rain.png',
        67: 'images/heavy-rain.png',
        71: 'images/snowflake.png',
        73: 'images/snowflake.png',
        75: 'images/snowflake.png',
        77: 'images/snowflake.png',
        80: 'images/sun-cloud-rain.png',
        81: 'images/sun-cloud-rain.png',
        82: 'images/sun-cloud-rain.png',
        85: 'images/cloud-hail.png',
        86: 'images/cloud-hail.png',
        95: 'images/bolt.png',
        96: 'images/bolt.png',
        99: 'images/bolt.png'

    }

    const iconClass = weatherIcons[weatherCode];

    return iconClass;
};

export default getWeatherIconClass;