const getWeather = async (time, parameters, locations, format) => {
    const apiUrl = `https://api.meteomatics.com/${time}/${parameters}/${locations}/${format}`;
    try {
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
    });
    const data = await response.json();
    return data;
} catch (error) {
    console.log(error);
}
}

export { getWeather };