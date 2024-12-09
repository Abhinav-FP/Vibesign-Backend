import {MinLength} from 'class-validator';
import {ApiProperty} from '../decorators';

export class MediaDirDto {
    @MinLength(3)
    @ApiProperty()
    name: string;

    @ApiProperty({hidden: true})
    parent: string;
}

export class AddMediaDirDto extends MediaDirDto {

}

export class EditMediaDirDto extends MediaDirDto {

}
