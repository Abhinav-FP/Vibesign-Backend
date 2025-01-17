import {FilterQuery, Types} from 'mongoose';
import {DateTime} from 'luxon';
import {
    IS_BOOLEAN, IsBoolean,
    IsDate,
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsStrongPassword,
    IsStrongPasswordOptions,
    MinLength
} from 'class-validator';
import {imageTypes, ToObjectId} from '@stemy/nest-utils';

import {UserRole} from '../common-types';
import {UserDoc} from '../schemas/user.schema';
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

    @IsNumber()
    @IsOptional()
    @ApiProperty()
    player: number = 0;

    @IsDate()
    @IsOptional()
    @ApiProperty({disableFilter: true, format: 'date'})
    expireDate: Date = new Date();

    @IsString()
    @IsOptional()
    @ApiProperty({disableFilter: true})
    picture: string = '';

    @IsBoolean()
    @IsOptional()
    @ApiProperty()
    active: boolean = true;

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
    name: string = '';

    @MinLength(3)
    @ApiProperty()
    username: string = '';

    @IsNumber()
    @IsOptional()
    @ApiProperty({serialize: true})
    playerLimit: number = 1;

    @IsDate()
    @IsOptional()
    @ApiProperty({format: 'date'})
    expireDate: Date = DateTime.now().plus({year: 20}).toJSDate()

    @IsBoolean()
    @IsOptional()
    @ApiProperty()
    active: boolean = true;

    @ApiProperty({type: 'file', accept: imageTypes, required: false})
    @ToObjectId()
    picture: Types.ObjectId;
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
