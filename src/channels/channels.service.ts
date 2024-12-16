import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {FilterQuery, Model} from 'mongoose';
import {IPagination, IPaginationParams, paginate} from '@stemy/nest-utils';

import {AddChannelDto} from './dtos/channel.dto';
import {Channel, ChannelDoc} from './schemas/channel.schema';
import {Playlist, PlaylistDoc} from "../playlists/schemas/playlist.schema";
import {UserDoc} from "../schemas/user.schema";

@Injectable()
export class ChannelsService {

    constructor(@InjectModel(Playlist.name) protected playlistModel: Model<Playlist>,
                @InjectModel(Channel.name) protected model: Model<Channel>) {
    }

    listPlaylists(owner: UserDoc): Promise<PlaylistDoc[]> {
        return this.playlistModel.find({ owner: owner._id });
    }

    paginate(query: FilterQuery<ChannelDoc>, params: IPaginationParams<Channel>): Promise<IPagination<ChannelDoc>> {
        return paginate(this.model, query, params);
    }

    create(dto: AddChannelDto): ChannelDoc {
        return new this.model(dto);
    }

    async delete(channel: ChannelDoc): Promise<any> {
        if (!channel) return null;
        return channel.deleteOne();
    }
}
