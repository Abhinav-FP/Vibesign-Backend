import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {AssetsModule} from '@stemy/nest-utils';

import {Channel, ChannelSchema} from './channel.schema';

import {ChannelsService} from './channels.service';
import {ChannelsController} from './channels.controller';
import {Playlist, PlaylistSchema} from '../playlists/playlist.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: Playlist.name, schema: PlaylistSchema},
            {name: Channel.name, schema: ChannelSchema},
        ]),
        AssetsModule
    ],
    controllers: [ChannelsController],
    providers: [ChannelsService],
    exports: [ChannelsService]
})
export class ChannelsModule {
}
