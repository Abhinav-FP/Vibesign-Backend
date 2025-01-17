import {IsString} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';
import { UserDto } from '../users/user.dto';

export class UserLoginDto {

    @ApiProperty()
    @IsString()
    credential: string;

    @ApiProperty()
    @IsString()
    password: string;
}

export class LoginResponseDto {
    token: string;
    user: UserDto;

    constructor(token?: string, user?: UserDto) {
        this.token = token;
        this.user = user;
    }
}
