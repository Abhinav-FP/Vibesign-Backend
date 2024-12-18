import {FilterQuery, Types} from 'mongoose';
import {IsOptional, IsString, MinLength} from 'class-validator';
import {imageTypes, ToObjectId, videoTypes} from '@stemy/nest-utils';

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
    name: string;

    @ApiProperty({type: 'file', accept: [...imageTypes, ...videoTypes], required: false})
    @ToObjectId()
    file: Types.ObjectId;

    // Handle preview generation
    preview: Types.ObjectId;

    // Mime type
    mimeType: string;

    // Extension
    ext: string;

    @IsOptional()
    @ToObjectId()
    @ApiProperty({hidden: true, required: false})
    parent: Types.ObjectId;

    path?: string;
}

export class AddMediaDto extends MediaDto {
    constructor() {
        super();
        this.file = null;
        this.preview = null;
        this.ext = '';
        this.parent = null;
        this.path = '';
    }
}

export class EditMediaDto extends MediaDto {

}
