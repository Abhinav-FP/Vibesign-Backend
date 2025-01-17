import {IsOptional, MinLength} from 'class-validator';
import {Types} from 'mongoose';
import {ToObjectId} from '@stemy/nest-utils';
import {ApiProperty} from '../decorators';

export class MediaDirDto {

    @MinLength(3)
    @ApiProperty()
    name: string = '';

    @IsOptional()
    @ToObjectId()
    @ApiProperty({hidden: true, required: false})
    parent: Types.ObjectId = null;

    path?: string = '';
}

export class AddMediaDirDto extends MediaDirDto {

}

export class EditMediaDirDto extends MediaDirDto {

}
