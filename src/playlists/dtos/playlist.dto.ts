import {FilterQuery, Types} from 'mongoose';
import {IsOptional, IsString, MinLength} from 'class-validator';
import {ToObjectId} from '@stemy/nest-utils';

import {ApiProperty} from '../../decorators';
import {UserDoc} from '../../schemas/user.schema';
import {PlaylistDoc} from '../schemas/playlist.schema';

export class ListPlaylistDto {

    @IsString()
    @IsOptional()
    @ApiProperty()
    name: string = '';

    toQuery(user: UserDoc): FilterQuery<PlaylistDoc> {
        return {
            name: {$regex: this.name, $options: 'i'},
            owner: user?._id
        } as FilterQuery<PlaylistDoc>;
    }
}

export class PlaylistDto {
    @MinLength(3)
    @ApiProperty()
    name: string = '';

    @ToObjectId()
    @ApiProperty({endpoint: 'playlists/media', multi: true, labelField: 'name', default: () => []})
    medias: Types.ObjectId[] = [];
}

export class AddPlaylistDto extends PlaylistDto {

}

export class EditPlaylistDto extends PlaylistDto {

}
