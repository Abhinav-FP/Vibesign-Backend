import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {FilterQuery, Model} from 'mongoose';
import {AssetsService, IPagination, IPaginationParams, paginate} from '@stemy/nest-utils';

import {AddPlaylistDto} from './dtos/playlist.dto';
import {Playlist, PlaylistDoc} from './schemas/playlist.schema';
import {Media, MediaDoc} from "../media/schemas/media.schema";
import {UserDoc} from "../schemas/user.schema";

@Injectable()
export class PlaylistService {

    constructor(readonly assets: AssetsService,
                @InjectModel(Media.name) protected mediaModel: Model<Media>,
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

    async delete(playlist: PlaylistDoc): Promise<any> {
        if (!playlist) return null;
        return playlist.deleteOne();
    }
}
