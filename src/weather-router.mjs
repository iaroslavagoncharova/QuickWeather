import express from 'express';
import { getWeatherData } from './weather-controller.mjs';


const weatherRouter = express.Router();
weatherRouter.get('/weather/:time/:parameters/:locations/:format', getWeatherData);

export default weatherRouter;

