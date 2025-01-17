import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {AssetsModule} from '@stemy/nest-utils';

import {MediaDir, MediaDirSchema} from './media-dir.schema';
import {Media, MediaSchema} from './media.schema';
import {Playlist, PlaylistSchema} from '../playlists/playlist.schema';

import {MediaService} from './media.service';

import {MediaController} from './media.controller';
import {MediaDirController} from './media-dir.controller';

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: MediaDir.name, schema: MediaDirSchema},
            {name: Media.name, schema: MediaSchema},
            {name: Playlist.name, schema: PlaylistSchema},
        ]),
        AssetsModule
    ],
    controllers: [MediaController, MediaDirController],
    providers: [MediaService],
    exports: [MediaService]
})
export class MediaModule {
}
