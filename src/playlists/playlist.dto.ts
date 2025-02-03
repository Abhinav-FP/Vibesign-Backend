import {FilterQuery, Types} from 'mongoose';
import {IsOptional, IsString, MinLength} from 'class-validator';
import {ToObjectId, toRegexFilter} from '@stemy/nest-utils';

import {ApiProperty} from '../decorators';
import {UserDoc} from '../users/user.schema';
import {PlaylistDoc} from './playlist.schema';

export class ListPlaylistDto {

    @IsString()
    @IsOptional()
    @ApiProperty()
    name: string = '';

    @IsOptional()
    @ApiProperty({format: 'datetime', disableFilter: true})
    createdAt: Date = null;

    @IsString()
    @IsOptional()
    filter: string = '';

    toQuery(user: UserDoc): FilterQuery<PlaylistDoc> {
        const query = toRegexFilter({
            name: this.name
        }, this.filter) as FilterQuery<PlaylistDoc>;
        query.owner = user._id;
        return query;
    }
}

export class PlaylistDto {
    @MinLength(3)
    @ApiProperty()
    name: string = '';

    @ToObjectId()
    @ApiProperty({required: false, endpoint: 'playlists/media', multi: true, labelField: 'name', default: () => []})
    medias: Types.ObjectId[] = [];
}

export class AddPlaylistDto extends PlaylistDto {

}

export class EditPlaylistDto extends PlaylistDto {

}
