import {FilterQuery} from 'mongoose';
import {IsEnum, IsOptional, IsString, MinLength} from 'class-validator';

import {ApiProperty} from '../decorators';
import {MediaType} from '../common-types';
import {UserDoc} from '../schemas/user.schema';
import {MediaDoc} from '../schemas/media.schema';

export class ListMediaDto {

    @IsString()
    @IsOptional()
    @ApiProperty({enum: MediaType})
    type: MediaType = MediaType.Directory;

    @IsString()
    @IsOptional()
    @ApiProperty()
    name: string = '';

    toQuery(user: UserDoc): FilterQuery<MediaDoc> {
        return {
            name: {$regex: this.name, $options: 'i'},
            owner: user.id
        };
    }
}

export class MediaDto {
    @MinLength(3)
    @ApiProperty()
    name: string;

    @ApiProperty({hidden: true})
    parent: string;
}

export class AddMediaDto extends MediaDto {

}

export class EditMediaDto extends MediaDto {

}
