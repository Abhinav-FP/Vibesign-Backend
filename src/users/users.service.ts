import {FilterQuery, Model} from 'mongoose';
import {hash} from 'bcrypt';
import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {
    addFieldStage,
    IAuthContext,
    IPagination,
    IPaginationParams,
    IUserHandler,
    lookupStages,
    matchStage,
    paginateAggregations,
    toRegexFilter
} from '@stemy/nest-utils';

import {UserRole} from '../common-types';
import {AddUserDto, EditUserDto, ListUserDto} from './user.dto';
import {User, UserDoc} from './user.schema';

@Injectable()
export class UsersService implements IUserHandler {

    constructor(@InjectModel(User.name) private model: Model<User>) {
        console.log('UsersService', this);
    }

    toQuery(dto: ListUserDto, user: UserDoc): FilterQuery<UserDoc> {
        const query = toRegexFilter({
            name: dto.name,
            username: dto.username,
            host: dto.host,
            email: dto.email,
            phone: dto.phone,
        }, dto.filter);
        if (user.role !== UserRole.Admin) {
            query.hostId = user._id;
        }
        return query;
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

    async findById(id: string): Promise<IAuthContext> {
        const user = await this.model.findById(id);
        if (!user) return null;
        return this.toContext(user);
    }

    async findByCredentials(credential: string, password: string): Promise<IAuthContext> {
        const user = await this.model.findOne({
            $or: [
                {username: credential},
                {email: credential},
            ],
        });
        if (user && user.password === await this.hashPassword(password)) {
            return this.toContext(user);
        }
        return null;
    }

    protected async toContext(user: UserDoc): Promise<IAuthContext> {
        if (user.role === UserRole.Manager) {
            await user.populate('host');
            const host = user.host as any;
            return {
                user: host,
                context: {
                    id: user.id,
                    roles: [host.role],
                    isManager: true,
                    username: user.username
                }
            };
        }
        return {
            user,
            context: {
                id: user.id,
                roles: [user.role],
            }
        };
    }

    protected async hashPassword(password: string): Promise<string> {
        return hash(password, '$2b$12$nLbWAfF5Tcev6r1sGU7C2.');
    }
}
