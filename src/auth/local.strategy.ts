import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';
import { ResponseUser, UserDocument } from '../schemas/user.schema';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {

    constructor(private authService: AuthService) {
        super({
            usernameField: 'credential',
        });
    }

    async validate(credential: string, password: string): Promise<UserDocument> {
        const user = await this.authService.validateUser(credential, password);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
