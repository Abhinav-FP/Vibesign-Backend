import { registerAs } from '@nestjs/config';
import { IAuthModuleOpts } from '@stemy/nest-utils';
import {UsersService} from "../users/users.service";

export default registerAs('auth', () => ({
    jwtSecret: process.env.JWT_SECRET || 'pN59L&amp;rPrdwL)RagHWjvaQJiT',
    tokenDuration: parseInt(process.env.JWT_TOKEN_DURATION || '36000'),
    userHandler: UsersService,
} as IAuthModuleOpts));
