import {DynamicModule, Module, Provider} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {
    AssetsModule,
    createRootModule,
    createRootModuleAsync,
    FromOptionsProviders,
    IModuleOptionsProvider
} from '@stemy/nest-utils';

import {WEATHER_MODULE_OPTIONS, WEATHER_API_KEY, IWeatherModuleOpts} from './common';
import {WeatherService} from './weather.service';
import {WeatherController} from './weather.controller';
import {Activity, ActivitySchema} from '../activities/activity.schema';
import {Device, DeviceSchema} from '../devices/device.schema';

export function createDashboardProviders(): Provider[] {
    return new FromOptionsProviders(WEATHER_MODULE_OPTIONS)
        .add(WeatherService)
        .useValue(WEATHER_API_KEY, opts => opts.apiKey || '')
        .asArray();
}

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: Activity.name, schema: ActivitySchema},
            {name: Device.name, schema: DeviceSchema},
        ])
    ],
    controllers: [WeatherController]
})
export class WeatherModule {

    static forRoot(opts?: IWeatherModuleOpts): DynamicModule {
        return createRootModule(
            WeatherModule,
            WEATHER_MODULE_OPTIONS,
            opts,
            createDashboardProviders()
        );
    }

    static forRootAsync(opts: IModuleOptionsProvider<IWeatherModuleOpts>): DynamicModule {
        return createRootModuleAsync(
            WeatherModule,
            WEATHER_MODULE_OPTIONS,
            opts,
            createDashboardProviders()
        );
    }
}
