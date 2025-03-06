import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {EventEmitter2} from '@nestjs/event-emitter';
import {FilterQuery, Model, Types} from 'mongoose';
import {IPagination, IPaginationParams, paginate, setAndUpdate} from '@stemy/nest-utils';

import {AddChannelDto, EditChannelDto} from './channel.dto';
import {Channel, ChannelDoc} from './channel.schema';
import {Playlist, PlaylistDoc} from '../playlists/playlist.schema';
import {UserDoc} from '../users/user.schema';
import {ChannelUpdated} from '../events/channel-updated';

@Injectable()
export class ChannelsService {

    constructor(@InjectModel(Playlist.name) protected playlistModel: Model<Playlist>,
                @InjectModel(Channel.name) protected model: Model<Channel>,
                protected eventEmitter: EventEmitter2) {
    }

    listPlaylists(owner: UserDoc): Promise<PlaylistDoc[]> {
        return this.playlistModel.find({ owner: owner._id }).populate('media');
    }

    paginate(query: FilterQuery<ChannelDoc>, params: IPaginationParams<Channel>): Promise<IPagination<ChannelDoc>> {
        return paginate(this.model, query, params);
    }

    async add(dto: AddChannelDto, owner: Types.ObjectId): Promise<ChannelDoc> {
        const channel = new this.model(dto);
        channel.owner = owner;
        this.eventEmitter.emit(ChannelUpdated.name, new ChannelUpdated(channel));
        return channel.save();
    }

    async update(channel: ChannelDoc, dto: EditChannelDto): Promise<ChannelDoc> {
        channel = await setAndUpdate(channel, dto);
        this.eventEmitter.emit(ChannelUpdated.name, new ChannelUpdated(channel));
        return channel;
    }

    async delete(channel: ChannelDoc): Promise<any> {
        if (!channel) return null;
        return channel.deleteOne();
    }
}
