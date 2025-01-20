import {IsString} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';

export class UserLoginDto {

    @ApiProperty()
    @IsString()
    credential: string;

    @ApiProperty()
    @IsString()
    password: string;
}
