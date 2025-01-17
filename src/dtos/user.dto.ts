import {FilterQuery, Types} from 'mongoose';
import {
    IsDate,
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsStrongPassword,
    MinLength
} from 'class-validator';

import {UserRole} from '../common-types';
import {UserDoc} from '../schemas/user.schema';
import {ApiProperty} from '../decorators';
import {imageTypes, ToObjectId, videoTypes} from "@stemy/nest-utils";

export class ListUserDto {

    @IsString()
    @IsOptional()
    @ApiProperty()
    name: string = '';

    @IsString()
    @IsOptional()
    @ApiProperty()
    username: string = '';

    @IsString()
    @IsOptional()
    @ApiProperty()
    email: string = '';

    @IsNumber()
    @IsOptional()
    @ApiProperty()
    player: number = 0;

    @IsDate()
    @IsOptional()
    @ApiProperty({disableFilter: true})
    expireDate: Date = new Date();

    @IsString()
    @IsOptional()
    @ApiProperty({disableFilter: true})
    picture: string = '';

    @IsOptional()
    @ApiProperty({filterType: 'checkbox'})
    host: string = '';

    toQuery(user: UserDoc): FilterQuery<UserDoc> {
        const query: FilterQuery<any> = {
            email: {$regex: this.email, $options: 'i'},
            name: {$regex: this.name, $options: 'i'},
            username: {$regex: this.username, $options: 'i'},
        };
        if (user.role !== UserRole.Admin) {
            query.host = user._id;
        }
        return query;
    }
}

export class UserDto {

    @IsNotEmpty()
    @IsEmail()
    @ApiProperty()
    email: string;

    @MinLength(3)
    @ApiProperty()
    name: string;

    @MinLength(3)
    @ApiProperty()
    username: string;
}

export class AddUserDto extends UserDto {

    @IsStrongPassword()
    @ApiProperty()
    password: string;

    @IsStrongPassword()
    @ApiProperty()
    confirmPassword: string;
}

export class EditUserDto extends UserDto {

    @IsString()
    @IsOptional()
    @ApiProperty({required: false})
    password: string;

    @IsString()
    @IsOptional()
    @ApiProperty({required: false})
    confirmPassword: string;

}
