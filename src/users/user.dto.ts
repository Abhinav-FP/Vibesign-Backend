import {FilterQuery, Types} from 'mongoose';
import {DateTime} from 'luxon';
import {
    IsBoolean,
    IsDate,
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsOptional, IsPhoneNumber,
    IsString,
    IsStrongPassword,
    IsStrongPasswordOptions,
    MinLength
} from 'class-validator';
import {imageTypes, ToObjectId, toRegexFilter} from '@stemy/nest-utils';

import {UserRole} from '../common-types';
import {UserDoc} from './user.schema';
import {ApiProperty} from '../decorators';

const strongPassword = {
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 0
} as IsStrongPasswordOptions;

export class ListUserDto {

    @IsString()
    @IsOptional()
    @ApiProperty()
    name: string = '';

    @IsString()
    @IsOptional()
    @ApiProperty()
    username: string = '';

    @IsOptional()
    @ApiProperty()
    host: string = '';

    @IsString()
    @IsOptional()
    @ApiProperty()
    email: string = '';

    @IsString()
    @IsOptional()
    @ApiProperty()
    phone?: string = '';

    @IsNumber()
    @IsOptional()
    @ApiProperty()
    devices?: number = 0;

    @IsDate()
    @IsOptional()
    @ApiProperty({disableFilter: true, format: 'date'})
    expireDate: Date = new Date();

    @IsString()
    @IsOptional()
    @ApiProperty({disableFilter: true, disableSort: true})
    picture: string = '';

    @IsBoolean()
    @IsOptional()
    @ApiProperty()
    active: boolean = true;

    filter: string = '';
}

export class UserDto {

    @MinLength(3)
    @ApiProperty()
    name: string = '';

    @IsEmail()
    @ApiProperty()
    email: string;

    @IsNotEmpty()
    @ApiProperty()
    phone?: string = '';

    @IsNumber()
    @IsOptional()
    @ApiProperty({serialize: true})
    deviceLimit?: number = 1;

    @IsDate()
    @IsOptional()
    @ApiProperty({format: 'date'})
    expireDate: Date = DateTime.now().plus({year: 20}).toJSDate()

    @ApiProperty({type: 'file', accept: imageTypes, required: false})
    @ToObjectId()
    picture: Types.ObjectId;

    @IsBoolean()
    @IsOptional()
    @ApiProperty()
    active: boolean = true;

    @MinLength(3)
    @ApiProperty()
    username: string = '';
}

export class AddUserDto extends UserDto {

    @IsStrongPassword(strongPassword)
    @ApiProperty()
    password: string;

    @IsStrongPassword(strongPassword)
    @ApiProperty()
    confirmPassword: string;
}

export class EditUserDto extends UserDto {

    @IsOptional()
    @IsStrongPassword(strongPassword)
    @ApiProperty({required: false})
    password: string;

    @IsOptional()
    @IsStrongPassword(strongPassword)
    @ApiProperty({required: false})
    confirmPassword: string;

}
