import {Body, Controller, Delete, ForbiddenException, Get, Patch, Post, Query} from '@nestjs/common';
import {AuthUser, QueryPipe, ResolveEntity} from '@stemy/nest-utils';

import {UsersService} from "./users.service";
import {User, UserDocument, UserRole} from "../schemas/user.schema";
import {AddUserDto, EditUserDto, ListUserDto} from "../dtos/user.dto";

@Controller('partners')
export class PartnersController {

    constructor(protected users: UsersService) {
    }

    @Get()
    async list(@AuthUser() authUser: UserDocument,
               @Query("page") page: number = 0,
               @Query("limit") limit: number = 20,
               @Query("sort") sort: string = "",
               @Query("query", QueryPipe) q: ListUserDto) {
        const query = q.toQuery(authUser);
        query.role = UserRole.Partner;
        const res = await this.users.paginate(query, {page, limit, sort, populate: ['host']});
        return {
            ...res,
            items: res.items.map(i => i.toJSON())
        };
    }

    @Get("/new/default")
    getDefault() {
        return new AddUserDto();
    }

    @Get("/:id")
    get(@ResolveEntity(User, ) user: UserDocument) {
        return user.toJSON();
    }

    @Post()
    async add(@AuthUser() authUser: UserDocument, @Body() dto: AddUserDto) {
        const user = await this.users.add(dto);
        user.role = UserRole.Partner;
        user.host = authUser.id;
        await user.save();
        return user.toJSON();
    }

    @Patch("/:id")
    async update(@ResolveEntity(User) user: UserDocument, @Body() dto: EditUserDto) {
        await this.users.update(user, dto);
        return user.toJSON();
    }

    @Delete("/:id")
    async delete(@AuthUser() authUser: UserDocument, @ResolveEntity(User) user: UserDocument) {
        if (authUser.id == user.id) {
            throw new ForbiddenException(`Can't remove own user`);
        }
        return user.deleteOne();
    }
}
