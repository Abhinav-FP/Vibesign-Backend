import {FactoryToken} from '@stemy/nest-utils';

export interface IWeatherModuleOpts {
    apiKey?: string;
}

export const WEATHER_API_KEY: FactoryToken<string> = Symbol.for('WEATHER_API_KEY');
export const WEATHER_MODULE_OPTIONS: FactoryToken<IWeatherModuleOpts> = Symbol.for('WEATHER_MODULE_OPTIONS');
