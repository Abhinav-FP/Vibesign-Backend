import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {AssetsModule} from '@stemy/nest-utils';

import {Media, MediaSchema} from "../media/schemas/media.schema";
import {Playlist, PlaylistSchema} from './schemas/playlist.schema';

import {PlaylistService} from "./playlist.service";
import {PlaylistController} from './playlist.controller';

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: Media.name, schema: MediaSchema},
            {name: Playlist.name, schema: PlaylistSchema},
        ]),
        AssetsModule
    ],
    controllers: [PlaylistController],
    providers: [PlaylistService],
    exports: [PlaylistService]
})
export class PlaylistModule {
}
