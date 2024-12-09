import {FilterQuery, Model} from 'mongoose';
import {hash} from 'bcrypt';
import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {IPagination, IPaginationParams, paginate} from '@stemy/nest-utils';

import {AddUserDto, EditUserDto} from '../dtos/user.dto';
import {User, UserDocument} from '../schemas/user.schema';

@Injectable()
export class UsersService {

    constructor(@InjectModel(User.name) private model: Model<User>) {
    }

    async hashPassword(password: string): Promise<string> {
        return hash(password, '$2b$12$nLbWAfF5Tcev6r1sGU7C2.');
    }

    async add(dto: AddUserDto): Promise<UserDocument> {
        if (dto.password !== dto.confirmPassword) {
            throw new HttpException('Passwords do not match', HttpStatus.BAD_REQUEST);
        }
        dto.password = await this.hashPassword(dto.password);
        const user = new this.model(dto);
        return user.save();
    }

    async update(user: UserDocument, dto: EditUserDto): Promise<UserDocument> {
        dto.password = !dto.password ? user.password : await this.hashPassword(dto.password);
        return user.updateOne(dto);
    }

    async findById(id: string): Promise<UserDocument> {
        return this.model.findById(id);
    }

    async findByCredential(credential: string): Promise<UserDocument> {
        return this.model.findOne({
            $or: [
                { username: credential },
                { email: credential },
            ],
        }).exec();
    }

    async paginate(where: FilterQuery<UserDocument>, params: IPaginationParams<User>): Promise<IPagination<UserDocument>> {
        return paginate(this.model, where, params);
    }
}
