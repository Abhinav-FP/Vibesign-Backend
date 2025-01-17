import {FilterQuery, Types} from 'mongoose';
import {IsOptional, IsString, MinLength} from 'class-validator';
import {ToObjectId, toRegexFilter} from '@stemy/nest-utils';

import {ApiProperty} from '../decorators';
import {UserDoc} from '../users/user.schema';
import {ChannelDoc} from './channel.schema';

export class ListChannelDto {

    @IsString()
    @IsOptional()
    @ApiProperty()
    name: string = '';

    filter: string = '';

    toQuery(user: UserDoc): FilterQuery<ChannelDoc> {
        const query = toRegexFilter({
            name: this.name
        }, this.filter) as FilterQuery<ChannelDoc>;
        query.owner = user._id;
        return query;
    }
}

export class ChannelDto {
    @MinLength(3)
    @ApiProperty()
    name: string = '';

    @ToObjectId()
    @ApiProperty({required: false, endpoint: 'channels/playlists', multi: true, labelField: 'name', default: () => []})
    playlists: Types.ObjectId[] = [];
}

export class AddChannelDto extends ChannelDto {

}

export class EditChannelDto extends ChannelDto {

}
