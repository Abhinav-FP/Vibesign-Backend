import {Body, Controller, Delete, ForbiddenException, Get, Patch, Post, Query} from '@nestjs/common';
import {AuthUser, QueryPipe, ResolveEntity} from '@stemy/nest-utils';

import {User, UserDocument, UserRole} from "../schemas/user.schema";
import {AddUserDto, EditUserDto, ListUserDto} from "../dtos/user.dto";
import {UsersService} from "./users.service";

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
        const params = {page, limit, sort, populate: ["host"]};
        const query = q.toQuery(authUser);
        query.role = UserRole.Partner;
        query.host = authUser.id;
        const res = await this.users.paginate(query, params);
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
    getUser(@ResolveEntity(User, ) user: UserDocument) {
        return user.toJSON();
    }

    @Post()
    async addUser(@AuthUser() authUser: UserDocument, @Body() dto: AddUserDto) {
        const user = await this.users.add(dto);
        user.host = authUser.id;
        user.role = UserRole.Partner;
        await user.save();
        return user.toJSON();
    }

    @Patch("/:id")
    async updateUser(@ResolveEntity(User) user: UserDocument, @Body() dto: EditUserDto) {
        dto.password = !dto.password ? user.password : await this.users.hashPassword(dto.password);
        await user.updateOne(dto);
        return user.toJSON();
    }

    @Delete("/:id")
    async deleteUser(@AuthUser() authUser: UserDocument, @ResolveEntity(User) user: UserDocument) {
        if (authUser.id == user.id) {
            throw new ForbiddenException(`Can't remove own user`);
        }
        return user.deleteOne();
    }
}
