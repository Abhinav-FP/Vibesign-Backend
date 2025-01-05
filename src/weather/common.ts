import {FactoryToken} from '@stemy/nest-utils';

export enum PrecipType {
    Ice = "ice",
    Rain = "rain",
    Snow = "snow",
}

export interface IWeatherConditions {
    datetime: string;
    datetimeEpoch: number;
    temp: number;
    feelslike: number;
    humidity: number;
    dew: number;
    precip: number;
    precipprob: number;
    snow: number | null;
    snowdepth: number;
    preciptype: PrecipType[];
    windgust: number;
    windspeed: number;
    winddir: number;
    pressure: number;
    visibility: number;
    cloudcover: number;
    solarradiation: number | null;
    solarenergy: number | null;
    uvindex: number | null;
    conditions: string;
    icon: string;
    sunrise?: string;
    sunriseEpoch?: number;
    sunset?: string;
    sunsetEpoch?: number;
    moonphase?: number;
    tempmax?: number;
    tempmin?: number;
    feelslikemax?: number;
    feelslikemin?: number;
    precipcover?: number;
    severerisk?: number;
    description?: string;
    day?: string;
    normal?: { [key: string]: number[] };

    [key: string]: any;
}

export interface IWeatherData {
    queryCost: number;
    latitude: number;
    longitude: number;
    resolvedAddress: string;
    address: string;
    timezone: string;
    description?: string;
    days: IWeatherConditions[];
    currentConditions: IWeatherConditions;
}

export interface IWeatherModuleOpts {
    apiKey?: string;
}

export const WEATHER_API_KEY: FactoryToken<string> = Symbol.for('WEATHER_API_KEY');
export const WEATHER_MODULE_OPTIONS: FactoryToken<IWeatherModuleOpts> = Symbol.for('WEATHER_MODULE_OPTIONS');
