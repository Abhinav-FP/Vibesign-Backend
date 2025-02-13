import {BadRequestException, Body, Controller, Delete, Get, Patch, Post, UseGuards} from '@nestjs/common';
import {ApiExtraModels} from '@nestjs/swagger';
import {AuthGuard} from '@nestjs/passport';
import {Auth, AuthService, AuthUser, IAuthContext, Public, ResolveEntity, TemplatesService} from '@stemy/nest-utils';

import {User, UserDoc} from '../users/user.schema';
import {UsersService} from '../users/users.service';
import {UserLoginDto, UserProfileDto} from './services/dto';

@Controller('auth')
export class AuthController {
    constructor(protected authService: AuthService,
                protected users: UsersService,
                protected templates: TemplatesService) {
    }

    @UseGuards(AuthGuard('local'))
    @Public()
    @Post('login')
    @ApiExtraModels(UserLoginDto)
    async login(@Auth() ctx: IAuthContext) {
        return this.authService.login(ctx);
    }

    @Public()
    @Post('forgot-password')
    async forgotPassword(@Body() dto: UserLoginDto) {
        const user = await this.users.findByCredential(dto.credential);
        if (user) {
            const test = await this.templates.render('forgot-password', 'en', {
                impersonator: user,
                context: {impersonator: user}
            });
            console.log(test);
        }
        return {
            message: `We sent the details to your e-mail address if the user exists`
        };
    }

    @Get('user')
    async user(@Auth() ctx: IAuthContext) {
        return this.authService.response(ctx);
    }

    @Patch('user')
    async update(@AuthUser() user: UserDoc, @Body() dto: UserProfileDto) {
        try {
            await this.users.update(user, dto);
        } catch (e) {
            throw new BadRequestException(`${e}`);
        }
        return user.toJSON();
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
