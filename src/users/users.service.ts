import {Connection, FilterQuery, Model} from 'mongoose';
import {hash} from 'bcrypt';
import {Injectable} from '@nestjs/common';
import {InjectConnection, InjectModel} from '@nestjs/mongoose';
import {
    addFieldStage,
    IPagination,
    IPaginationParams,
    lookupStages,
    matchStage,
    paginateAggregations
} from '@stemy/nest-utils';

import {AddUserDto, EditUserDto} from './user.dto';
import {User, UserDoc} from './user.schema';
import {Manager} from '../managers/manager.schema';

@Injectable()
export class UsersService {

    constructor(@InjectModel(User.name) private model: Model<User>,
                @InjectModel(Manager.name) private managerModel: Model<Manager>) {

    }

    async hashPassword(password: string): Promise<string> {
        return hash(password, '$2b$12$nLbWAfF5Tcev6r1sGU7C2.');
    }

    async add(dto: AddUserDto): Promise<UserDoc> {
        if (dto.password !== dto.confirmPassword) {
            throw new Error('Passwords do not match');
        }
        dto.password = await this.hashPassword(dto.password);
        const user = new this.model(dto);
        return user.save();
    }

    async update(user: UserDoc, dto: EditUserDto): Promise<UserDoc> {
        if (dto.password !== dto.confirmPassword) {
            throw new Error('Passwords do not match');
        }
        dto.password = !dto.password ? user.password : await this.hashPassword(dto.password);
        return user.updateOne(dto);
    }

    async findById(id: string): Promise<UserDoc> {
        return this.model.findById(id);
    }

    async findByCredentials(credential: string, password: string): Promise<UserDoc> {
        const user = await this.model.findOne({
            $or: [
                { username: credential },
                { email: credential },
            ],
        });
        if (user && user.password === await this.hashPassword(password)) {
            return user;
        }
        const manager = await this.managerModel.findOne({
            $or: [
                { username: credential },
                { email: credential },
            ],
        });
        if (manager && manager.password === password) {
            await manager.populate('host')
            return manager.host as any;
        }
        return null;
    }

    async paginate(where: FilterQuery<UserDoc>, params: IPaginationParams<User>): Promise<IPagination<UserDoc>> {
        return paginateAggregations(this.model, [
            ...lookupStages('users', 'host'),
            addFieldStage({
                host: '$host.name'
            }),
            ...lookupStages('devices', '_id', 'devices', 'owner', false),
            addFieldStage({
                devices: {
                    $size: '$devices'
                }
            }),
            matchStage(where)
        ], params);
    }
}
