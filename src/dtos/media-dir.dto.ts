import {IsOptional, MinLength} from 'class-validator';
import {ApiProperty} from '../decorators';

export class MediaDirDto {

    @MinLength(3)
    @ApiProperty()
    name: string = '';

    @IsOptional()
    @ApiProperty({hidden: true, required: false})
    parent: string = null;

    path: string = '';
}

export class AddMediaDirDto extends MediaDirDto {

}

export class EditMediaDirDto extends MediaDirDto {

}
