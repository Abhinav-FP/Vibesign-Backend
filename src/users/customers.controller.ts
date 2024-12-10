import {Body, Controller, Delete, ForbiddenException, Get, Patch, Post, Query} from '@nestjs/common';
import {AuthUser, QueryPipe, ResolveEntity} from '@stemy/nest-utils';

import {UserRole} from '../common-types';
import {UsersService} from './users.service';
import {User, UserDoc} from '../schemas/user.schema';
import {AddUserDto, EditUserDto, ListUserDto} from '../dtos/user.dto';

@Controller('customers')
export class CustomersController {

    constructor(protected users: UsersService) {
    }

    @Get()
    async list(@AuthUser() authUser: UserDoc,
               @Query('page') page: number = 0,
               @Query('limit') limit: number = 20,
               @Query('sort') sort: string = '',
               @Query('query', QueryPipe) q: ListUserDto) {
        const query = q.toQuery(authUser);
        query.role = UserRole.Customer;
        const res = await this.users.paginate(query, {page, limit, sort, populate: ['host']});
        return {
            ...res,
            items: res.items.map(i => i.toJSON())
        };
    }

    @Get('/new/default')
    getDefault() {
        return new AddUserDto();
    }

    @Get('/:id')
    get(@ResolveEntity(User, ) user: UserDoc) {
        return user.toJSON();
    }

    @Post()
    async add(@AuthUser() authUser: UserDoc, @Body() dto: AddUserDto) {
        const user = await this.users.add(dto);
        user.role = UserRole.Customer;
        user.host = authUser._id;
        await user.save();
        return user.toJSON();
    }

    @Patch('/:id')
    async update(@ResolveEntity(User) user: UserDoc, @Body() dto: EditUserDto) {
        await this.users.update(user, dto);
        return user.toJSON();
    }

    @Delete('/:id')
    async delete(@AuthUser() authUser: UserDoc, @ResolveEntity(User) user: UserDoc) {
        if (authUser.id == user.id) {
            throw new ForbiddenException(`Can't remove own user`);
        }
        return user.deleteOne();
    }
}
