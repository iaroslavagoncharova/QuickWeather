import { getWeather } from "./weather-model.mjs";

const getWeatherData = async (req, res) => {
    const { time, parameters, locations, format } = req.params;
    const result = await getWeather(time, parameters, locations, format);
    if (result) {
        res.status(200).json(result);
    } else {
        res.status(400).json({ error: 'Invalid request' });
    }
}

export { getWeatherData };