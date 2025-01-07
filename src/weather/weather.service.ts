import axios, {AxiosInstance} from 'axios';
import {Model} from 'mongoose';
import {DateTime} from 'luxon';
import {Inject, Injectable} from '@nestjs/common'
import {InjectModel} from '@nestjs/mongoose';
import {TemplatesService} from '@stemy/nest-utils';

import {IWeatherData, WEATHER_API_KEY} from './common';
import {Device} from '../devices/schemas/device.schema';
import {Activity} from '../activities/schemas/activity.schema';
import {MediaDoc, MediaType} from '../media/schemas/media.schema';
import {sampleData} from './data';
import {locales} from "./locales";

@Injectable()
export class WeatherService {

    protected client: AxiosInstance;

    constructor(readonly templates: TemplatesService,
                @InjectModel(Device.name) protected deviceModel: Model<Device>,
                @InjectModel(Activity.name) protected activityModel: Model<Activity>,
                @Inject(WEATHER_API_KEY) protected apiKey: string) {
        this.client = axios.create({
            baseURL: `https://api.weatherstack.com/forecast`,
            method: 'get'
        });
    }

    async getInfo(media: MediaDoc): Promise<string> {
        if (media.mediaType !== MediaType.Weather) {
            throw new Error('Media type is not weather');
        }
        const weather = await this.getWeatherData(media);
        return this.templates.render('weather', 'en', {
            ...weather,
            ...media.toJSON(),
        });
    }

    async getWeatherData(media: MediaDoc): Promise<IWeatherData> {
        const {address, forecastLocale, forecastDays} = media;
        const data = Object.assign({}, sampleData);
        data.days = data.days.map(d => {
            d.day = DateTime.fromSQL(d.datetime)
                .setLocale(forecastLocale)
                .weekdayShort;
            return d;
        });
        return data;
    }

    async getLocales(country: string) {
        const list = Array.from(locales);
        const ending = `-${country}`.toLowerCase();
        return list.sort((a, b) => {
            const ac = a.id.toLowerCase().endsWith(ending) ? 0 : 1;
            const bc = b.id.toLowerCase().endsWith(ending) ? 0 : 1;
            const res = ac - bc;

            if (res !== 0) {
                return res;
            }

            return a.label.localeCompare(b.label);
        });
    }
}
