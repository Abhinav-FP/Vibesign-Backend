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

const strongPattern = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d]{6,}$';

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
    host?: string = '';

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
    expiryDate: Date = new Date();

    @IsString()
    @IsOptional()
    @ApiProperty({disableFilter: true, disableSort: true})
    picture: string = '';

    @IsBoolean()
    @IsOptional()
    @ApiProperty()
    active: boolean = true;

    @IsString()
    @IsOptional()
    filter: string = '';
}

export class UserDto {

    @MinLength(3)
    @ApiProperty()
    name: string = '';

    @IsEmail()
    @ApiProperty({format: 'email'})
    email: string;

    @IsNotEmpty()
    @ApiProperty()
    phone?: string = '';

    @IsNumber()
    @IsOptional()
    @ApiProperty({serialize: true})
    deviceLimit?: number;

    @IsDate()
    @IsOptional()
    @ApiProperty({format: 'date'})
    expiryDate: Date;

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
    @ApiProperty({pattern: strongPattern})
    password: string;

    @IsStrongPassword(strongPassword)
    @ApiProperty({pattern: strongPattern})
    confirmPassword: string;
}

export class EditUserDto extends UserDto {

    @IsOptional()
    @IsStrongPassword(strongPassword)
    @ApiProperty({required: false, pattern: strongPattern})
    password: string;

    @IsOptional()
    @IsStrongPassword(strongPassword)
    @ApiProperty({required: false, pattern: strongPattern})
    confirmPassword: string;

}
