import {FilterQuery, Types} from 'mongoose';
import {
    IsBoolean, IsDate, IsEmail,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString, IsStrongPassword, IsStrongPasswordOptions,
    MaxLength,
    MinLength,
    ValidateNested
} from 'class-validator';
import {imageTypes, ToObjectId, toRegexFilter} from '@stemy/nest-utils';

import {ApiProperty} from '../decorators';
import {UserDoc} from '../users/user.schema';
import {ManagerDoc} from './manager.schema';

const strongPassword = {
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 0
} as IsStrongPasswordOptions;

export class ListManagerDto {

    @IsString()
    @IsOptional()
    @ApiProperty()
    username: string = '';

    @IsString()
    @IsOptional()
    @ApiProperty()
    firstName: string = '';

    @IsString()
    @IsOptional()
    @ApiProperty()
    lastName: string = '';

    @IsString()
    @IsOptional()
    @ApiProperty()
    email: string = '';

    @IsString()
    @IsOptional()
    @ApiProperty()
    phone: string = '';

    @IsBoolean()
    @IsOptional()
    @ApiProperty()
    active: boolean = true;

    @IsString()
    @IsOptional()
    @ApiProperty({disableFilter: true, disableSort: true})
    picture: string = '';

    filter: string = '';

    toQuery(user: UserDoc): FilterQuery<ManagerDoc> {
        const query = toRegexFilter({
            username: this.username,
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            phone: this.phone,
        }, this.filter) as FilterQuery<ManagerDoc>;
        query.host = user._id;
        return query;
    }
}

export class ManagerDto {

    @MinLength(3)
    @ApiProperty()
    firstName: string = '';

    @MinLength(3)
    @ApiProperty()
    lastName: string = '';

    @IsNotEmpty()
    @IsEmail()
    @ApiProperty()
    email: string = '';

    @IsNotEmpty()
    @ApiProperty()
    phone: string = '';

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

export class AddManagerDto extends ManagerDto {

    @IsStrongPassword(strongPassword)
    @ApiProperty()
    password: string;

    @IsStrongPassword(strongPassword)
    @ApiProperty()
    confirmPassword: string;

}

export class EditManagerDto extends ManagerDto {

    @IsOptional()
    @IsStrongPassword(strongPassword)
    @ApiProperty({required: false})
    password: string;

    @IsOptional()
    @IsStrongPassword(strongPassword)
    @ApiProperty({required: false})
    confirmPassword: string;
}
