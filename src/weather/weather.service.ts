import axios, {AxiosInstance} from 'axios';
import {Model} from 'mongoose';
import {DateTime, FixedOffsetZone} from 'luxon';
import {Inject, Injectable} from '@nestjs/common'
import {InjectModel} from '@nestjs/mongoose';
import {TemplatesService} from '@stemy/nest-utils';

import {IWeatherData, WEATHER_API_KEY} from './common';
import {Device} from '../devices/schemas/device.schema';
import {Activity} from '../activities/schemas/activity.schema';
import {MediaAddress, MediaDoc, MediaType} from '../media/schemas/media.schema';
import {sampleData} from './data';

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

    async info(media: MediaDoc): Promise<string> {
        if (media.mediaType !== MediaType.Weather) {
            throw new Error('Media type is not weather');
        }
        const weather = await this.getWeatherData(media.address);
        return this.templates.render('weather', 'en', {
            ...weather,
            ...media.toJSON(),
        });
    }

    async getWeatherData(address: MediaAddress): Promise<IWeatherData> {
        const data = Object.assign({}, sampleData);
        const zone = FixedOffsetZone.instance(330);
        data.days = data.days.map(d => {
            console.log(DateTime.fromSQL(d.datetime)
                .setZone(zone, {keepLocalTime: true}));
            d.day = DateTime.fromSQL(d.datetime)
                .setZone(zone)
                .setLocale('bn-IN')
                .weekdayShort;
            return d;
        });
        return data;
    }
}
