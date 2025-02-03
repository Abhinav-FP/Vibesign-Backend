import {FilterQuery, Types} from 'mongoose';
import {
    IsBoolean,
    IsEnum,
    IsHexColor,
    IsNumber,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
    ValidateNested
} from 'class-validator';
import {ToObjectId, toRegexFilter} from '@stemy/nest-utils';

import {ApiProperty} from '../decorators';
import {UserDoc} from '../users/user.schema';
import {DeviceDoc, DeviceSizing, DeviceTransition} from './device.schema';

export class ListDeviceDto {

    @IsString()
    @IsOptional()
    @ApiProperty()
    name: string = '';

    @IsOptional()
    @ApiProperty({format: 'datetime', disableFilter: true})
    createdAt: Date = null;

    @IsString()
    @IsOptional()
    filter: string = '';

    toQuery(user: UserDoc): FilterQuery<DeviceDoc> {
        const query = toRegexFilter({
            name: this.name,
        }, this.filter) as FilterQuery<DeviceDoc>;
        query.owner = user._id;
        return query;
    }
}

export class DeviceAddressDto {

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
    @ApiProperty({required: false})
    countryCode: string = 'IN';
}

export class DeviceCoordsDto {

    @IsNumber()
    @IsOptional()
    @ApiProperty({required: false})
    x: number = 0;

    @IsNumber()
    @IsOptional()
    @ApiProperty({required: false})
    y: number = 0;
}

export class DeviceSettingsDto {

    @IsOptional()
    @ApiProperty({required: false, type: () => DeviceCoordsDto})
    offset: DeviceCoordsDto = new DeviceCoordsDto();

    @IsOptional()
    @ApiProperty({required: false, type: () => DeviceCoordsDto})
    resolution: DeviceCoordsDto = new DeviceCoordsDto();

    @IsEnum(DeviceSizing)
    @ApiProperty({enum: DeviceSizing, required: false})
    sizing: DeviceSizing = DeviceSizing.Fill;

    @IsEnum(DeviceTransition)
    @ApiProperty({enum: DeviceTransition, required: false})
    transition: DeviceTransition = DeviceTransition.Fade;

    @IsHexColor()
    @ApiProperty({format: 'color', required: false})
    background: string = '#000000';
}

export class DeviceScreenInfoDto {

    @IsString()
    @ApiProperty({required: false})
    manufacturer: string = '';

    @IsString()
    @ApiProperty({required: false})
    model: string = '';

    @IsString()
    @ApiProperty({required: false})
    size: string = '';

    @IsString()
    @ApiProperty({required: false})
    screenResolution: string = '';

    @IsString()
    @ApiProperty({required: false})
    contentResolution: string = '';
}

export class DeviceDto {
    @MinLength(3)
    @ApiProperty()
    name: string = '';

    @MinLength(6)
    @MaxLength(6)
    @ApiProperty()
    hexCode: string = '';

    @ToObjectId()
    @IsOptional()
    @ApiProperty({endpoint: 'devices/channels', labelField: 'name'})
    channel: Types.ObjectId;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({required: false})
    active: boolean = true;

    @ValidateNested()
    @ApiProperty({type: () => DeviceSettingsDto})
    settings: DeviceSettingsDto = new DeviceSettingsDto();

    @ValidateNested()
    @ApiProperty({type: () => DeviceScreenInfoDto})
    screenInfo: DeviceScreenInfoDto = new DeviceScreenInfoDto();

    @ValidateNested()
    @ApiProperty({type: () => DeviceAddressDto})
    address: DeviceAddressDto = new DeviceAddressDto();
}

export class AddDeviceDto extends DeviceDto {

}

export class EditDeviceDto extends DeviceDto {

}
