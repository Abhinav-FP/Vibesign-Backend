import {DynamicModule, Module, Provider} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {createRootModule, createRootModuleAsync, FromOptionsProviders, IModuleOptionsProvider} from '@stemy/nest-utils';

import {MISC_MODULE_OPTIONS, EXPO_PASSWORD, EXPO_USER, IMiscModuleOpts} from './common';
import {Device, DeviceSchema} from '../devices/device.schema';
import {Channel, ChannelSchema} from '../channels/channel.schema';

import {SocketGateway} from './services/socket-gateway';
import {DashboardService} from './services/dashboard.service';
import {AssetFileTypeService} from './services/file-type.service';
import {CompressionAssetProcessorService} from './services/compression-asset-processor.service';

import {DashboardController} from './dashboard.controller';
import {AuthController} from './auth.controller';

export function createDashboardProviders(): Provider[] {
    return new FromOptionsProviders(MISC_MODULE_OPTIONS)
        .add(
            CompressionAssetProcessorService,
            AssetFileTypeService,
            DashboardService,
            SocketGateway
        )
        .useValue(EXPO_USER, opts => opts.expoUser || '')
        .useValue(EXPO_PASSWORD, opts => opts.expoPassword || '')
        .asArray();
}

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: Channel.name, schema: ChannelSchema},
            {name: Device.name, schema: DeviceSchema},
        ])
    ],
    controllers: [AuthController, DashboardController]
})
export class MiscModule {

    static forRoot(opts?: IMiscModuleOpts): DynamicModule {
        return createRootModule(
            MiscModule,
            MISC_MODULE_OPTIONS,
            opts,
            createDashboardProviders()
        );
    }

    static forRootAsync(opts: IModuleOptionsProvider<IMiscModuleOpts>): DynamicModule {
        return createRootModuleAsync(
            MiscModule,
            MISC_MODULE_OPTIONS,
            opts,
            createDashboardProviders()
        );
    }
}
