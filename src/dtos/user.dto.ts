import {IsEmail, IsNotEmpty, IsOptional, IsString, IsStrongPassword, MinLength} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";
import {UserDocument} from '../schemas/user.schema';
import {FilterQuery} from "mongoose";

export class ListUserDto {

    @IsString()
    @IsOptional()
    @ApiProperty()
    email: string = "";

    @IsString()
    @IsOptional()
    @ApiProperty()
    name: string = "";

    @IsString()
    @IsOptional()
    @ApiProperty()
    username: string = "";

    @IsString()
    @IsOptional()
    @ApiProperty()
    host: string = "";

    toQuery(user: UserDocument): FilterQuery<UserDocument> {
        const query: FilterQuery<any> = {
            name: {$regex: this.name, $options: "gi"}
        };
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
