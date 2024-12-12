import {IsOptional, MinLength} from 'class-validator';
import {Type} from 'class-transformer';
import {Types} from 'mongoose';
import {ApiProperty} from '../../decorators';

export class MediaDirDto {

    @MinLength(3)
    @ApiProperty()
    name: string = '';

    @IsOptional()
    @Type(() => Types.ObjectId)
    @ApiProperty({hidden: true, required: false})
    parent: Types.ObjectId = null;

    path: string = '';
}

export class AddMediaDirDto extends MediaDirDto {

}

export class EditMediaDirDto extends MediaDirDto {

}
