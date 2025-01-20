import {Body, Controller, Delete, ForbiddenException, Get, Patch, Post, Query} from '@nestjs/common';
import {ApiExtraModels} from '@nestjs/swagger';
import {AuthUser, ComplexQuery, ResolveEntity} from '@stemy/nest-utils';

import {UserRole} from '../common-types';
import {UsersService} from './users.service';
import {User, UserDoc} from './user.schema';
import {AddPartnerDto, EditPartnerDto, ListPartnerDto} from './partner.dto';

@Controller('partners')
export class PartnersController {

    constructor(protected users: UsersService) {
    }

    @Get()
    @ApiExtraModels(ListPartnerDto)
    async list(@AuthUser() authUser: UserDoc,
               @Query('page') page: number = 0,
               @Query('limit') limit: number = 20,
               @Query('sort') sort: string = '',
               @ComplexQuery() dto: ListPartnerDto) {
        const query = this.users.toQuery(dto, authUser);
        query.role = UserRole.Partner;
        const res = await this.users.paginate(query, {page, limit, sort});
        return {
            ...res,
            items: res.items.map(i => i.toJSON())
        };
    }

    @Get('/new/default')
    getDefault() {
        return new AddPartnerDto();
    }

    @Get('/:id')
    get(@ResolveEntity(User) user: UserDoc) {
        return user.toJSON();
    }

    @Post()
    async add(@AuthUser() authUser: UserDoc, @Body() dto: AddPartnerDto) {
        const user = await this.users.add(dto);
        user.role = UserRole.Partner;
        user.host = authUser._id;
        await user.save();
        return user.toJSON();
    }

    @Patch('/:id')
    async update(@ResolveEntity(User) user: UserDoc, @Body() dto: EditPartnerDto) {
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
