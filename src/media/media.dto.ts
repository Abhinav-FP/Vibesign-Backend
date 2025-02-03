import {FilterQuery, Types} from 'mongoose';
import {IsEnum, IsNumber, IsOptional, IsString, Min, MinLength, ValidateNested} from 'class-validator';
import {imageTypes, ToObjectId, videoTypes, toRegexFilter} from '@stemy/nest-utils';

import {ApiProperty} from '../decorators';
import {UserDoc} from '../users/user.schema';
import {ForecastDays, ForecastUnits, MediaDoc, MediaType} from './media.schema';

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

    @IsString()
    @IsOptional()
    filter: string = '';

    toQuery(user: UserDoc, parent: Types.ObjectId, forFile: boolean): FilterQuery<MediaDoc> {
        const query = toRegexFilter({
            name: this.name,
            mediaType: this.mediaType,
            mimeType: this.mimeType
        }, this.filter) as FilterQuery<MediaDoc>;
        if (!forFile) {
            delete query.mediaType;
            delete query.mimeType;
        } else if (this.template) {
            query.template = {$exists: true};
        }
        query.owner = user._id;
        query.parent = parent;
        return query;
    }
}

export class MediaAddressDto {

    @MinLength(3)
    @IsOptional()
    @ApiProperty()
    address: string = 'Rajkot, Gujarat, India';

    @IsNumber()
    @ApiProperty({step: 0.000000001})
    lat: number = 22.3038945;

    @IsNumber()
    @ApiProperty({step: 0.000000001})
    lng: number = 70.80215989999999;

    @IsString()
    @ApiProperty()
    countryCode: string = 'IN';
}

export class MediaDto {
    @MinLength(3)
    @ApiProperty()
    name: string;

    @IsEnum(MediaType)
    @ApiProperty({enum: MediaType})
    mediaType: MediaType;

    @Min(1)
    @ApiProperty()
    duration: number;

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

    @IsEnum(ForecastDays)
    @IsOptional()
    @ApiProperty({enum: ForecastDays})
    forecastDays: ForecastDays;

    @IsEnum(ForecastUnits)
    @IsOptional()
    @ApiProperty({enum: ForecastUnits})
    forecastUnits: ForecastUnits;

    @IsString()
    @IsOptional()
    @ApiProperty({endpoint: 'weather/locales?country=$address.countryCode'})
    forecastLocale: string;

    @ValidateNested()
    @IsOptional()
    @ApiProperty({required: false, serialize: true, type: () => MediaAddressDto})
    address: MediaAddressDto;

    @IsOptional()
    @ToObjectId()
    @ApiProperty({hidden: true, required: false})
    parent: Types.ObjectId;

    path?: string;
}

export class AddMediaDto extends MediaDto {
    constructor() {
        super();
        this.name = '';
        this.mediaType = MediaType.File;
        this.duration = 10;
        this.file = null;
        this.preview = null;
        this.ext = '';
        this.forecastDays = ForecastDays.FiveDays;
        this.forecastUnits = ForecastUnits.Metric;
        this.forecastLocale = 'gu-IN';
        this.address = new MediaAddressDto();
        this.parent = null;
        this.path = '';
    }
}

export class EditMediaDto extends MediaDto {

}
