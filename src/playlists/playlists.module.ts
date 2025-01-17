import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {AssetsModule} from '@stemy/nest-utils';

import {Media, MediaSchema} from '../media/media.schema';
import {Playlist, PlaylistSchema} from './playlist.schema';
import {Channel, ChannelSchema} from '../channels/channel.schema';

import {PlaylistsService} from './playlists.service';
import {PlaylistsController} from './playlists.controller';

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: Media.name, schema: MediaSchema},
            {name: Playlist.name, schema: PlaylistSchema},
            {name: Channel.name, schema: ChannelSchema},
        ]),
        AssetsModule
    ],
    controllers: [PlaylistsController],
    providers: [PlaylistsService],
    exports: [PlaylistsService]
})
export class PlaylistsModule {
}
