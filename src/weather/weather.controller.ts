import {BadRequestException, Controller, Get, Header} from '@nestjs/common';
import {Public, ResolveEntity} from '@stemy/nest-utils';
import {WeatherService} from './weather.service';
import {Media, MediaDoc} from "../media/schemas/media.schema";

@Controller('weather')
export class WeatherController {

    constructor(protected weather: WeatherService) {
    }

    @Public()
    @Get('/:mediaId/info')
    @Header('Content-Type', () => 'text/html')
    async info(@ResolveEntity(Media) media: MediaDoc) {
        try {
            return await this.weather.info(media);
        } catch (e) {
            throw new BadRequestException(`${e}`);
        }
    }
}
