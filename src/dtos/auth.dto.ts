import { UserDto } from './user.dto';

export class LoginResponseDto {
    token: string;
    user: UserDto;

    constructor(token?: string, user?: UserDto) {
        this.token = token;
        this.user = user;
    }
}
