import {FilterQuery, Types} from 'mongoose';
import {IsBoolean, IsNumber, IsOptional, IsString, MaxLength, MinLength, ValidateNested} from 'class-validator';
import {ToObjectId} from '@stemy/nest-utils';

import {ApiProperty} from '../../decorators';
import {UserDoc} from '../../schemas/user.schema';
import {DeviceDoc} from '../schemas/device.schema';

export class ListDeviceDto {

    @IsString()
    @IsOptional()
    @ApiProperty()
    name: string = '';

    @IsString()
    @IsOptional()
    @ApiProperty()
    hexCode: string = '';

    toQuery(user: UserDoc): FilterQuery<DeviceDoc> {
        return {
            name: {$regex: this.name, $options: 'i'},
            hexCode: {$regex: this.hexCode, $options: 'i'},
            owner: user?._id
        } as FilterQuery<DeviceDoc>;
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
