import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {EventEmitter2} from '@nestjs/event-emitter';
import {FilterQuery, Model, Types} from 'mongoose';
import {IPagination, IPaginationParams, paginate, setAndUpdate} from '@stemy/nest-utils';

import {AddPlaylistDto, EditPlaylistDto} from './playlist.dto';
import {UserDoc} from '../users/user.schema';
import {Media, MediaDoc} from '../media/media.schema';
import {Channel} from '../channels/channel.schema';
import {Playlist, PlaylistDoc} from './playlist.schema';
import {PlaylistUpdated} from '../events/playlist-updated';

@Injectable()
export class PlaylistsService {

    constructor(@InjectModel(Media.name) protected mediaModel: Model<Media>,
                @InjectModel(Channel.name) protected channelModel: Model<Channel>,
                @InjectModel(Playlist.name) protected model: Model<Playlist>,
                protected eventEmitter: EventEmitter2) {
    }

    listMedias(owner: UserDoc): Promise<MediaDoc[]> {
        return this.mediaModel.find({ owner: owner._id });
    }

    paginate(query: FilterQuery<PlaylistDoc>, params: IPaginationParams<Playlist>): Promise<IPagination<PlaylistDoc>> {
        return paginate(this.model, query, params);
    }

    async add(dto: AddPlaylistDto, owner: Types.ObjectId): Promise<PlaylistDoc> {
        const playlist = new this.model(dto);
        playlist.owner = owner;
        this.eventEmitter.emit(PlaylistUpdated.name, new PlaylistUpdated(playlist));
        return playlist.save();
    }

    async update(playlist: PlaylistDoc, dto: EditPlaylistDto): Promise<PlaylistDoc> {
        playlist = await setAndUpdate(playlist, dto);
        this.eventEmitter.emit(PlaylistUpdated.name, new PlaylistUpdated(playlist));
        return playlist;
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
