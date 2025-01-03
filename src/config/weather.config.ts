import {registerAs} from '@nestjs/config';
import {IWeatherModuleOpts} from '../weather/common';

export default registerAs('weather', () => ({
    apiKey: process.env.WEATHER_API_KEY || '3cb35003ebe53b4c4f54ea5f86409a79'
} as IWeatherModuleOpts));
