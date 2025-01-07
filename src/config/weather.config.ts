import {registerAs} from '@nestjs/config';
import {IWeatherModuleOpts} from '../weather/common';

export default registerAs('weather', () => ({
    apiKey: process.env.WEATHER_API_KEY || '8WYSW9ZQMS9L23KDF29SEMUSD'
} as IWeatherModuleOpts));
