import axios, {AxiosInstance} from 'axios';
import {Model} from 'mongoose';
import {Inject, Injectable} from '@nestjs/common'
import {InjectModel} from '@nestjs/mongoose';
import {TemplatesService} from '@stemy/nest-utils';

import {WEATHER_API_KEY} from './common';
import {Device} from '../devices/schemas/device.schema';
import {Activity} from '../activities/schemas/activity.schema';
import {MediaDoc, MediaType} from '../media/schemas/media.schema';

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
        return this.templates.render('weather', 'en');
    }
}
