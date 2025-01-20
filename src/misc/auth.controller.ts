import {Controller, Delete, Get, Post, UseGuards} from '@nestjs/common';
import {ApiExtraModels} from '@nestjs/swagger';
import {AuthGuard} from '@nestjs/passport';
import {Auth, AuthService, IAuthContext, Public, ResolveEntity} from '@stemy/nest-utils';

import {UserLoginDto} from './auth.dto';
import {User, UserDoc} from '../users/user.schema';

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

    @Post('impersonations/:id')
    async impersonate(@Auth() ctx: IAuthContext, @ResolveEntity(User) target: UserDoc) {
        return this.authService.impersonate(ctx, target.id);
    }

    @Delete('impersonations')
    async endImpersonate(@Auth() ctx: IAuthContext) {
        return this.authService.endImpersonate(ctx);
    }
}
