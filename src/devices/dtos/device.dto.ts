import {FilterQuery, Types} from 'mongoose';
import {IsBoolean, IsOptional, IsString, MaxLength, MinLength} from 'class-validator';
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
}

export class AddDeviceDto extends DeviceDto {

}

export class EditDeviceDto extends DeviceDto {

}
