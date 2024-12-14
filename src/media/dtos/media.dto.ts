import {FilterQuery, Types} from 'mongoose';
import {IsOptional, IsString, MinLength} from 'class-validator';
import {Type} from 'class-transformer';

import {ApiProperty} from '../../decorators';
import {UserDoc} from '../../schemas/user.schema';
import {MediaDoc} from '../schemas/media.schema';

export class ListMediaDto {

    @IsString()
    @IsOptional()
    @ApiProperty()
    name: string = '';

    @IsString()
    @IsOptional()
    @ApiProperty()
    mimeType: string = '';

    toQuery(user: UserDoc, parent: Types.ObjectId, useMime: boolean): FilterQuery<MediaDoc> {
        const res = {
            name: {$regex: this.name, $options: 'i'},
            mimeType: {$regex: this.mimeType, $options: 'i'},
            owner: user._id,
            parent: parent
        } as FilterQuery<MediaDoc>;
        if (!useMime) {
            delete res.mimeType;
        }
        return res;
    }
}

export class MediaDto {
    @MinLength(3)
    @ApiProperty()
    name: string = '';

    @ApiProperty({type: 'file', accept: ['image/png', 'image/jpeg', 'video/mp4'], required: false})
    @Type(() => Types.ObjectId)
    file: Types.ObjectId = null;

    // Handle preview generation
    preview: Types.ObjectId = null;

    // Mime type
    mimeType: string = '';

    // Extension
    ext: string = '';

    @IsOptional()
    @Type(() => Types.ObjectId)
    @ApiProperty({hidden: true, required: false})
    parent: Types.ObjectId = null;

    path: string = '';
}

export class AddMediaDto extends MediaDto {

}

export class EditMediaDto extends MediaDto {

}
