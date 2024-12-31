import {join} from 'path';
import {APP_GUARD} from '@nestjs/core';
import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {MongooseModule} from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import {AssetsModule} from '@stemy/nest-utils';

import {AuthModule} from './auth/auth.module';
import {JwtGuard} from './auth/jwt.guard';
import {UsersModule} from './users/users.module';
import {JwtStrategy} from './auth/jwt.strategy';

import assetsConfig from './config/assets.config';
import authConfig from './config/auth.config';
import dashboardConfig from './config/dashboard.config';
import databaseConfig from './config/database.config';

import {MediaModule} from './media/media.module';
import {PlaylistsModule} from './playlists/playlists.module';
import {ChannelsModule} from './channels/channels.module';
import {DevicesModule} from './devices/devices.module';
import {TicketsModule} from './tickets/tickets.module';
import {DashboardModule} from './dashboard/dashboard.module';
import {AssetFileTypeService} from './services/file-type.service';
import {CompressionAssetProcessorService} from './services/compression-asset-processor.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [assetsConfig, authConfig, dashboardConfig, databaseConfig],
            cache: true,
            isGlobal: true,
        }),
        MongooseModule.forRootAsync(databaseConfig.asProvider()),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'client'),
        }),
        AssetsModule.forRootAsync(
            assetsConfig.asProvider(),
            AssetFileTypeService,
            CompressionAssetProcessorService
        ),
        AuthModule,
        AuthModule,
        UsersModule,
        MediaModule,
        PlaylistsModule,
        ChannelsModule,
        DevicesModule,
        TicketsModule,
        DashboardModule.forRootAsync(dashboardConfig.asProvider())
    ],
    controllers: [],
    providers: [
        {
            provide: APP_GUARD,
            useClass: JwtGuard,
        },
        JwtStrategy,
    ],
})
export class AppModule {
}
