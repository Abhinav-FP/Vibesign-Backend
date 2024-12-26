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

import databaseConfig from './config/database.config';
import authConfig from './config/auth.config';
import {CompressionAssetProcessorService} from './services/compression-asset-processor.service';
import {AssetFileTypeService} from './services/file-type.service'

import {MediaModule} from './media/media.module';
import {PlaylistsModule} from './playlists/playlists.module';
import {ChannelsModule} from './channels/channels.module';
import {DevicesModule} from './devices/devices.module';
import {TicketsModule} from './tickets/tickets.module';
import {DashboardModule} from './dashboard/dashboard.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [databaseConfig, authConfig],
            cache: true,
            isGlobal: true,
        }),
        MongooseModule.forRootAsync(databaseConfig.asProvider()),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'client'),
        }),
        AssetsModule.forRoot({
            assetProcessor: CompressionAssetProcessorService,
            typeDetector: AssetFileTypeService
        }),
        AuthModule,
        UsersModule,
        MediaModule,
        PlaylistsModule,
        ChannelsModule,
        DevicesModule,
        TicketsModule,
        DashboardModule
    ],
    controllers: [],
    providers: [
        {
            provide: APP_GUARD,
            useClass: JwtGuard,
        },
        JwtStrategy
    ],
})
export class AppModule {
}
