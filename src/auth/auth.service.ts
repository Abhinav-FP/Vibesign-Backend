import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ResponseUser, User, UserDoc } from '../schemas/user.schema';
import { UsersService } from '../users/users.service';
import { LoginResponseDto } from '../dtos/auth.dto';

@Injectable()
export class AuthService {

    constructor(private users: UsersService, private jwt: JwtService) {
    }

    async validateUser(credential: string, password: string): Promise<UserDoc> {
        const user = await this.users.findByCredential(credential);
        if (user && user.password === await this.users.hashPassword(password)) {
            return user;
        }
        return null;
    }

    async byId(id: string): Promise<UserDoc> {
        return this.users.findById(id);
    }

    async login(user: UserDoc): Promise<LoginResponseDto> {
        const payload = { username: user.username, id: user.id };
        return new LoginResponseDto(this.jwt.sign(payload), user);
    }
}
