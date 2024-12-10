import {FilterQuery} from 'mongoose';
import {IsEmail, IsNotEmpty, IsOptional, IsString, IsStrongPassword, MinLength} from 'class-validator';

import {UserRole} from '../common-types';
import {UserDoc} from '../schemas/user.schema';
import {ApiProperty} from '../decorators';

export class ListUserDto {

    @IsString()
    @IsOptional()
    @ApiProperty()
    email: string = '';

    @IsString()
    @IsOptional()
    @ApiProperty()
    name: string = '';

    @IsString()
    @IsOptional()
    @ApiProperty()
    username: string = '';

    @IsOptional()
    @ApiProperty({filterType: 'checkbox'})
    host: string = '';

    toQuery(user: UserDoc): FilterQuery<UserDoc> {
        const query: FilterQuery<any> = {
            email: {$regex: this.email, $options: 'i'},
            name: {$regex: this.name, $options: 'i'},
            username: {$regex: this.username, $options: 'i'},
        };
        if (!this.host || (user.role != UserRole.Admin && user.role != UserRole.SuperAdmin)) {
            query.host = user._id;
        }
        if (user.role) return query;
        // query.profile = user.profile.id;
        return query;
    }
}

export class UserDto {

    @IsNotEmpty()
    @IsEmail()
    @ApiProperty()
    email: string;

    @MinLength(10)
    @ApiProperty()
    name: string;

    @MinLength(5)
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
    @ApiProperty()
    password: string;

    @IsString()
    @ApiProperty()
    confirmPassword: string;

}
