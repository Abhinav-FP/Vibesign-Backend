import {BadRequestException, Controller, Get, Post, UseGuards} from '@nestjs/common';
import {ApiExtraModels} from "@nestjs/swagger";
import {AuthGuard} from '@nestjs/passport';
import {AuthUser, Public} from "@stemy/nest-utils";

import {AuthService} from './auth.service';
import {LoginResponseDto, UserLoginDto} from '../dtos/auth.dto';
import {ResponseUser, UserDoc} from '../schemas/user.schema';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {
    }

    @UseGuards(AuthGuard('local'))
    @Public()
    @Post('login')
    @ApiExtraModels(UserLoginDto)
    async login(@AuthUser() user: UserDoc): Promise<LoginResponseDto | BadRequestException> {
        return this.authService.login(user);
    }

    @Get('user')
    async user(@AuthUser() user: UserDoc): Promise<ResponseUser | BadRequestException> {
        return user.toJSON();
    }

    // @Post('register')
    // async register(@Body() registerBody: RegisterRequestDto): Promise<RegisterResponseDTO | BadRequestException> {
    //     return await this.authService.register(registerBody);
    // }
}
