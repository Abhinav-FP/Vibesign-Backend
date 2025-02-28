import {BadRequestException, Body, Controller, Delete, Get, Inject, Patch, Post, UseGuards} from '@nestjs/common';
import {ApiExtraModels} from '@nestjs/swagger';
import {AuthGuard} from '@nestjs/passport';
import {Auth, AuthService, AuthUser, IAuthContext, Public, ResolveEntity, MailerService, Language} from '@stemy/nest-utils';

import {User, UserDoc} from '../users/user.schema';
import {UsersService} from '../users/users.service';

import {UI_URL} from './common';
import {UserLoginDto, UserProfileDto} from './services/dto';

@Controller('auth')
export class AuthController {
    constructor(protected authService: AuthService,
                protected users: UsersService,
                protected mailer: MailerService,
                @Inject(UI_URL) protected uiUrl: string) {
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
    async forgotPassword(@Body() dto: UserLoginDto, @Language() language: string) {
        const context = await this.users.findByCredential(dto.credential);
        if (context) {
            const {user, token} = this.authService.login(context);
            const resetLink = `${this.uiUrl}/login?token=${encodeURI(token)}`;
            const mail = this.mailer.create({
                to: user.email,
                content: {
                    template: 'forgot-password',
                    context: {
                        user,
                        resetLink,
                        resetLinkText: resetLink.match(/.{1,10}/g).join('&#8203;')
                    },
                    language
                },
                subject: 'mail.forgot-password.subject'
            }).attach({
                content: this.mailer.templateAsset('logo.png'),
                filename: 'logo.png'
            }, 'logo');
            await mail.send();
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
