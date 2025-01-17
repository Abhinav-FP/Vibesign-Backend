import {BadRequestException, Controller, Get, Header, Query} from '@nestjs/common';
import {Public, ResolveEntity} from '@stemy/nest-utils';
import {WeatherService} from './weather.service';
import {Media, MediaDoc} from '../media/media.schema';

@Controller('weather')
export class WeatherController {

    constructor(protected weather: WeatherService) {
    }

    @Public()
    @Get('/:mediaId/info')
    @Header('Content-Type', () => 'text/html')
    async info(@ResolveEntity(Media) media: MediaDoc) {
        try {
            return await this.weather.getInfo(media);
        } catch (e) {
            throw new BadRequestException(`${e}`);
        }
    }

    @Public()
    @Get('/locales')
    async locales(@Query('country') country: string) {
        try {
            return await this.weather.getLocales(country);
        } catch (e) {
            throw new BadRequestException(`${e}`);
        }
    }
}
