import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    ForbiddenException,
    Get,
    Patch,
    Post,
    Query
} from '@nestjs/common';
import {ApiExtraModels} from '@nestjs/swagger';
import {AuthUser, ComplexQuery, ResolveEntity} from '@stemy/nest-utils';

import {UserRole} from '../common-types';
import {UsersService} from './users.service';
import {User, UserDoc} from './user.schema';
import {AddManagerDto, EditManagerDto, ListManagerDto} from './manager.dto';

@Controller('managers')
export class ManagersController {

    constructor(protected users: UsersService) {
    }

    @Get()
    @ApiExtraModels(ListManagerDto)
    async list(@AuthUser() authUser: UserDoc,
               @Query('page') page: number = 0,
               @Query('limit') limit: number = 20,
               @Query('sort') sort: string = '',
               @ComplexQuery() dto: ListManagerDto) {
        const query = this.users.toQuery(dto, authUser);
        query.role = UserRole.Manager;
        const res = await this.users.paginate(query, {page, limit, sort});
        return {
            ...res,
            items: res.items.map(i => i.toJSON())
        };
    }

    @Get('new/default')
    getDefault() {
        return new AddManagerDto();
    }

    @Get(':id')
    get(@ResolveEntity(User) user: UserDoc) {
        return user.toJSON();
    }

    @Post()
    async add(@AuthUser() authUser: UserDoc, @Body() dto: AddManagerDto) {
        try {
            const user = await this.users.add(dto, UserRole.Manager, authUser._id);
            return user.toJSON();
        } catch (e) {
            throw new BadRequestException(`${e}`);
        }
    }

    @Patch(':id')
    async update(@ResolveEntity(User) user: UserDoc, @Body() dto: EditManagerDto) {
        try {
            await this.users.update(user, dto);
        } catch (e) {
            throw new BadRequestException(`${e}`);
        }
        return user.toJSON();
    }

    @Delete(':id')
    async delete(@AuthUser() authUser: UserDoc, @ResolveEntity(User) user: UserDoc) {
        if (authUser.id == user.id) {
            throw new ForbiddenException(`Can't remove own user`);
        }
        return user.deleteOne();
    }
}
