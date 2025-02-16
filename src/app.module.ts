import {join} from 'path';
import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {EventEmitterModule} from '@nestjs/event-emitter';
import {MongooseModule} from '@nestjs/mongoose';
import {ServeStaticModule} from '@nestjs/serve-static';
import {AssetsModule, AuthModule, TemplatesModule, TranslationModule, TranslationService, MailerModule} from '@stemy/nest-utils';

import assetsConfig from './config/assets.config';
import authConfig from './config/auth.config';
import miscConfig from './config/misc.config';
import mailerConfig from './config/mailer.config';
import databaseConfig from './config/database.config';
import weatherConfig from './config/weather.config';

import {UsersModule} from './users/users.module';
import {MediaModule} from './media/media.module';
import {PlaylistsModule} from './playlists/playlists.module';
import {ChannelsModule} from './channels/channels.module';
import {DevicesModule} from './devices/devices.module';
import {TicketsModule} from './tickets/tickets.module';
import {MiscModule} from './dashboard/misc.module';
import {WeatherModule} from './weather/weather.module';

@Module({
    imports: [
        // 3rd party modules
        ConfigModule.forRoot({
            load: [assetsConfig, authConfig, miscConfig, mailerConfig, databaseConfig, weatherConfig],
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
        TranslationModule.forRoot({
            translationsPath: join(__dirname, 'public', 'i18n')
        }),
        TemplatesModule.forRoot({
            templatesDir: join(__dirname, 'templates'),
            translator: TranslationService,
        }),
        MailerModule.forRootAsync(mailerConfig.asProvider()),
        // App modules
        UsersModule.forRoot(),
        MediaModule,
        PlaylistsModule,
        ChannelsModule,
        DevicesModule,
        TicketsModule,
        WeatherModule.forRootAsync(weatherConfig.asProvider()),
        MiscModule.forRootAsync(miscConfig.asProvider()),
    ],
    controllers: []
})
export class AppModule {
}
