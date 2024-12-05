import { BadRequestException, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { Public } from '../decorators/public.decorator';
import { AuthService } from './auth.service';
import { LoginResponseDto } from '../dtos/auth.dto';
import { ResponseUser, User, UserDocument } from '../schemas/user.schema';
import { AuthUser } from '../decorators/auth-user.decorator';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @UseGuards(AuthGuard('local'))
    @Public()
    @Post('login')
    async login(@AuthUser() user: UserDocument): Promise<LoginResponseDto | BadRequestException> {
        return this.authService.login(user);
    }

    @Get('user')
    async user(@AuthUser() user: UserDocument): Promise<ResponseUser | BadRequestException> {
        return user.toJSON();
    }

    // @Post('register')
    // async register(@Body() registerBody: RegisterRequestDto): Promise<RegisterResponseDTO | BadRequestException> {
    //     return await this.authService.register(registerBody);
    // }
}
