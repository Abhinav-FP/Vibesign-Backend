import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {FilterQuery, Model} from 'mongoose';
import {IPagination, IPaginationParams, paginate, setAndUpdate} from '@stemy/nest-utils';

import {AddPlaylistDto, EditPlaylistDto} from './dtos/playlist.dto';
import {UserDoc} from '../schemas/user.schema';
import {Media, MediaDoc} from '../media/schemas/media.schema';
import {Channel} from '../channels/schemas/channel.schema';
import {Playlist, PlaylistDoc} from './schemas/playlist.schema';

@Injectable()
export class PlaylistsService {

    constructor(@InjectModel(Media.name) protected mediaModel: Model<Media>,
                @InjectModel(Channel.name) protected channelModel: Model<Channel>,
                @InjectModel(Playlist.name) protected model: Model<Playlist>) {
    }

    listMedias(owner: UserDoc): Promise<MediaDoc[]> {
        return this.mediaModel.find({ owner: owner._id });
    }

    paginate(query: FilterQuery<PlaylistDoc>, params: IPaginationParams<Playlist>): Promise<IPagination<PlaylistDoc>> {
        return paginate(this.model, query, params);
    }

    create(dto: AddPlaylistDto): PlaylistDoc {
        return new this.model(dto);
    }

    update(playlist: PlaylistDoc, dto: EditPlaylistDto) {
        return setAndUpdate(playlist, dto);
    }

    async delete(playlist: PlaylistDoc): Promise<any> {
        if (!playlist) return null;
        const channels = await this.channelModel
            .find({ playlists: {$in: [playlist._id]}});
        for (const channel of channels) {
            const playlists = channel.playlists.filter(c => !c?.equals(playlist._id));
            await channel.updateOne({playlists});
        }
        return playlist.deleteOne();
    }
}
