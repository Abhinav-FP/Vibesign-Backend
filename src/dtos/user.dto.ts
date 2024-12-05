import { IsNotEmpty, IsEmail, MinLength, IsStrongPassword, IsString, IsEnum } from 'class-validator';
import { UserRole } from '../schemas/user.schema';

export class UserDto {

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @MinLength(10)
    name: string;

    @MinLength(5)
    username: string;

    @IsEnum(UserRole)
    role: UserRole;
}

export class AddUserDto extends UserDto {

    @IsStrongPassword()
    password: string;

    @IsStrongPassword()
    confirmPassword: string;
}

export class EditUserDto extends UserDto {

    @IsString()
    password: string;

    @IsString()
    confirmPassword: string;

}
