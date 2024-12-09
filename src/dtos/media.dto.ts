import {FilterQuery} from 'mongoose';
import {IsOptional, IsString, MinLength} from 'class-validator';

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
    name: string = '';

    @ApiProperty({type: 'file', required: false})
    file: string = '';

    @IsOptional()
    @ApiProperty({hidden: true, required: false})
    parent: string = '';

    path: string = '';
}

export class AddMediaDto extends MediaDto {

}

export class EditMediaDto extends MediaDto {

}
