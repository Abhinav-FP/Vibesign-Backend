import {FilterQuery, Types} from 'mongoose';
import {IsBoolean, IsNumber, IsOptional, IsString, MaxLength, MinLength, ValidateNested} from 'class-validator';
import {ToObjectId, toRegexFilter} from '@stemy/nest-utils';

import {ApiProperty} from '../decorators';
import {UserDoc} from '../users/user.schema';
import {DeviceDoc} from './device.schema';

export class ListDeviceDto {

    @IsString()
    @IsOptional()
    @ApiProperty()
    name: string = '';

    @IsString()
    @IsOptional()
    @ApiProperty()
    hexCode: string = '';

    filter: string = '';

    toQuery(user: UserDoc): FilterQuery<DeviceDoc> {
        const query = toRegexFilter({
            name: this.name,
            hexCode: this.hexCode,
        }, this.filter) as FilterQuery<DeviceDoc>;
        query.owner = user._id;
        return query;
    }
}

export class DeviceAddressDto {

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
    @ApiProperty({type: () => DeviceAddressDto})
    address: DeviceAddressDto = new DeviceAddressDto();
}

export class AddDeviceDto extends DeviceDto {

}

export class EditDeviceDto extends DeviceDto {

}
