import {DynamicModule, Module, Provider} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {
    AssetsModule,
    createRootModule,
    createRootModuleAsync,
    FromOptionsProviders,
    IModuleOptionsProvider
} from '@stemy/nest-utils';

import {DASHBOARD_MODULE_OPTIONS, EXPO_PASSWORD, EXPO_USER, IDashboardModuleOpts} from './common';
import {DashboardService} from './dashboard.service';
import {DashboardController} from './dashboard.controller';
import {Activity, ActivitySchema} from '../activities/activity.schema';
import {Device, DeviceSchema} from '../devices/device.schema';

export function createDashboardProviders(): Provider[] {
    return new FromOptionsProviders(DASHBOARD_MODULE_OPTIONS)
        .add(DashboardService)
        .useValue(EXPO_USER, opts => opts.expoUser || '')
        .useValue(EXPO_PASSWORD, opts => opts.expoPassword || '')
        .asArray();
}

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: Activity.name, schema: ActivitySchema},
            {name: Device.name, schema: DeviceSchema},
        ]),
        AssetsModule
    ],
    controllers: [DashboardController]
})
export class DashboardModule {

    static forRoot(opts?: IDashboardModuleOpts): DynamicModule {
        return createRootModule(
            DashboardModule,
            DASHBOARD_MODULE_OPTIONS,
            opts,
            createDashboardProviders()
        );
    }

    static forRootAsync(opts: IModuleOptionsProvider<IDashboardModuleOpts>): DynamicModule {
        return createRootModuleAsync(
            DashboardModule,
            DASHBOARD_MODULE_OPTIONS,
            opts,
            createDashboardProviders()
        );
    }
}
