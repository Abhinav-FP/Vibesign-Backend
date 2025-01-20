import {Controller, Get, Post, UseGuards} from '@nestjs/common';
import {ApiExtraModels} from '@nestjs/swagger';
import {AuthGuard} from '@nestjs/passport';
import {Auth, AuthService, IAuthContext, Public} from '@stemy/nest-utils';

import {UserLoginDto} from './auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {
    }

    @UseGuards(AuthGuard('local'))
    @Public()
    @Post('login')
    @ApiExtraModels(UserLoginDto)
    async login(@Auth() ctx: IAuthContext) {
        return this.authService.login(ctx);
    }

    @Get('user')
    async user(@Auth() ctx: IAuthContext) {
        return this.authService.response(ctx);
    }
}
