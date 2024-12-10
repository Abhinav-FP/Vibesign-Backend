import {APP_GUARD} from '@nestjs/core';
import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {MongooseModule} from '@nestjs/mongoose';
import {AssetsModule} from '@stemy/nest-utils';

import {AuthModule} from './auth/auth.module';
import {JwtGuard} from './auth/jwt.guard';
import {UsersModule} from './users/users.module';
import {JwtStrategy} from './auth/jwt.strategy';

import databaseConfig from './config/database.config';
import authConfig from './config/auth.config';
import {MediaModule} from "./media/media.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [databaseConfig, authConfig],
            cache: true,
            isGlobal: true,
        }),
        MongooseModule.forRootAsync(databaseConfig.asProvider()),
        AssetsModule.forRoot(),
        AuthModule,
        UsersModule,
        MediaModule
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
