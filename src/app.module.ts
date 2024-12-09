import {APP_GUARD} from '@nestjs/core';
import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {MongooseModule} from '@nestjs/mongoose';
import {MediaController} from './controllers/media.controller';
import {AuthModule} from './auth/auth.module';
import {JwtGuard} from './auth/jwt.guard';
import {UsersModule} from './users/users.module';
import {JwtStrategy} from './auth/jwt.strategy';
import databaseConfig from './config/database.config';
import authConfig from './config/auth.config';
import {MediaDir, MediaDirSchema} from './schemas/media-dir.schema';
import {Media, MediaSchema} from './schemas/media.schema';

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [databaseConfig, authConfig],
            cache: true,
            isGlobal: true,
        }),
        MongooseModule.forFeature([
            {name:  MediaDir.name, schema: MediaDirSchema},
            {name: Media.name, schema: MediaSchema},
        ]),
        MongooseModule.forRootAsync(databaseConfig.asProvider()),
        AuthModule,
        UsersModule,
    ],
    controllers: [MediaController],
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
