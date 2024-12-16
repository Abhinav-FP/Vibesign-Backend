import {FilterQuery, Types} from 'mongoose';
import {IsOptional, IsString, MinLength} from 'class-validator';
import {ToObjectId} from '@stemy/nest-utils';

import {ApiProperty} from '../../decorators';
import {UserDoc} from '../../schemas/user.schema';
import {ChannelDoc} from '../schemas/channel.schema';

export class ListChannelDto {

    @IsString()
    @IsOptional()
    @ApiProperty()
    name: string = '';

    toQuery(user: UserDoc): FilterQuery<ChannelDoc> {
        return {
            name: {$regex: this.name, $options: 'i'},
        } as FilterQuery<ChannelDoc>;
    }
}

export class ChannelDto {
    @MinLength(3)
    @ApiProperty()
    name: string = '';

    @ToObjectId()
    @ApiProperty({endpoint: 'channels/playlists', multi: true, labelField: 'name', default: () => []})
    playlists: Types.ObjectId[] = [];
}

export class AddChannelDto extends ChannelDto {

}

export class EditChannelDto extends ChannelDto {

}
