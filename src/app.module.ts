import {join} from 'path';
import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {EventEmitterModule} from '@nestjs/event-emitter';
import {MongooseModule} from '@nestjs/mongoose';
import {ServeStaticModule} from '@nestjs/serve-static';
import {AssetsModule, AuthModule, TemplatesModule} from '@stemy/nest-utils';

import assetsConfig from './config/assets.config';
import authConfig from './config/auth.config';
import dashboardConfig from './config/dashboard.config';
import databaseConfig from './config/database.config';
import weatherConfig from './config/weather.config';

import {UsersModule} from './users/users.module';
import {MediaModule} from './media/media.module';
import {PlaylistsModule} from './playlists/playlists.module';
import {ChannelsModule} from './channels/channels.module';
import {DevicesModule} from './devices/devices.module';
import {TicketsModule} from './tickets/tickets.module';
import {DashboardModule} from './dashboard/dashboard.module';
import {ActivitiesModule} from './activities/activities.module';
import {WeatherModule} from './weather/weather.module';
import {MiscModule} from './misc/misc.module';

@Module({
    imports: [
        // 3rd party modules
        ConfigModule.forRoot({
            load: [assetsConfig, authConfig, dashboardConfig, databaseConfig, weatherConfig],
            cache: true,
            isGlobal: true,
        }),
        EventEmitterModule.forRoot({global: true}),
        MongooseModule.forRootAsync(databaseConfig.asProvider()),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, 'public'),
            renderPath: '/',
            exclude: ['/api/(.*)'],
        }),
        // @stemy Nest utils modules
        AssetsModule.forRootAsync(assetsConfig.asProvider()),
        AuthModule.forRootAsync(authConfig.asProvider()),
        TemplatesModule.forRoot({
            templatesDir: join(__dirname, 'templates'),
        }),
        // App modules
        MiscModule,
        UsersModule.forRoot(),
        MediaModule,
        PlaylistsModule,
        ChannelsModule,
        DevicesModule,
        TicketsModule,
        ActivitiesModule,
        DashboardModule.forRootAsync(dashboardConfig.asProvider()),
        WeatherModule.forRootAsync(weatherConfig.asProvider()),
    ],
    controllers: []
})
export class AppModule {
}
