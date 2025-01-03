import {FilterQuery, Types} from 'mongoose';
import {IsEnum, IsNumber, IsOptional, IsString, MinLength, ValidateNested} from 'class-validator';
import {imageTypes, ToObjectId, videoTypes} from '@stemy/nest-utils';

import {ApiProperty} from '../../decorators';
import {UserDoc} from '../../schemas/user.schema';
import {MediaDoc, MediaType} from '../schemas/media.schema';

export class ListMediaDto {

    @IsString()
    @IsOptional()
    @ApiProperty()
    name: string = '';

    @IsString()
    @IsOptional()
    @ApiProperty()
    mediaType: string = '';

    @IsString()
    @IsOptional()
    @ApiProperty()
    mimeType: string = '';

    @IsOptional()
    @ApiProperty({filterType: 'checkbox'})
    template: string = '';

    toQuery(user: UserDoc, parent: Types.ObjectId, forFile: boolean): FilterQuery<MediaDoc> {
        const query = {
            name: {$regex: this.name, $options: 'i'},
            mediaType: {$regex: this.mediaType, $options: 'i'},
            mimeType: {$regex: this.mimeType, $options: 'i'},
            owner: user._id,
            parent: parent
        } as FilterQuery<MediaDoc>;
        if (!forFile) {
            delete query.mediaType;
            delete query.mimeType;
        } else if (this.template) {
            query.template = {$exists: true};
        }
        return query;
    }
}

export class WeatherAddressDto {

    @MinLength(3)
    @IsOptional()
    @ApiProperty()
    address: string = '';

    @IsNumber()
    @ApiProperty({step: 0.000000001})
    lat: number;

    @IsNumber()
    @ApiProperty({step: 0.000000001})
    lng: number;
}

export class MediaDto {
    @MinLength(3)
    @ApiProperty()
    name: string = '';

    @IsEnum(MediaType)
    @ApiProperty({enum: MediaType})
    mediaType: MediaType = MediaType.File;

    @ApiProperty({type: 'file', accept: [...imageTypes, ...videoTypes], required: false})
    @ToObjectId()
    file: Types.ObjectId;

    @ApiProperty({type: 'file', accept: ['application/json'], hidden: true, serialize: true, required: false})
    @ToObjectId()
    template: Types.ObjectId;

    // Handle preview generation
    preview: Types.ObjectId;

    // Mime type
    mimeType: string;

    // Extension
    ext: string;

    @ValidateNested()
    @IsOptional()
    @ApiProperty({required: false, serialize: true, type: () => WeatherAddressDto})
    address: WeatherAddressDto;

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
        this.address = new WeatherAddressDto();
        this.address.address = 'Rajkot, Gujarat, India';
        this.address.lat = 22.3038945;
        this.address.lng = 70.80215989999999;
        this.parent = null;
        this.path = '';
    }
}

export class EditMediaDto extends MediaDto {

}
