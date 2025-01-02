import {FilterQuery} from 'mongoose';
import {IsNumber, IsOptional, IsString, MinLength, ValidateNested} from 'class-validator';

import {ApiProperty} from '../../decorators';
import {ActivityDoc} from '../schemas/activity.schema';
import {UserDoc} from "../../schemas/user.schema";

export class LocationDto {

    @IsNumber()
    @ApiProperty({step: 0.000000001})
    lat: number;

    @IsNumber()
    @ApiProperty({step: 0.000000001})
    lng: number;
}

export class ListActivityDto {

    @IsOptional()
    @ApiProperty()
    createdAt: Date = null;

    @IsString()
    @IsOptional()
    @ApiProperty()
    name: string = '';

    @IsString()
    @IsOptional()
    @ApiProperty()
    address: string = '';

    toQuery(user: UserDoc): FilterQuery<ActivityDoc> {
        return {
            name: {$regex: this.name, $options: 'i'},
            address: {$regex: this.address, $options: 'i'},
            owner: user?._id
        } as FilterQuery<ActivityDoc>;
    }
}

export class ActivityDto {

    @MinLength(3)
    @IsOptional()
    @ApiProperty()
    address: string = '';

    @ValidateNested()
    @IsOptional()
    @ApiProperty({type: () => LocationDto})
    location: LocationDto = new LocationDto();

}

export class AddActivityDto extends ActivityDto {
}

export class EditActivityDto extends ActivityDto {

    @MinLength(3)
    @ApiProperty()
    name: string = '';

}
