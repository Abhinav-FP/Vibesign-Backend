import {BadRequestException, Body, Controller, Delete, Get, Patch, Post, Query} from '@nestjs/common';
import {ApiExtraModels} from '@nestjs/swagger';
import {AuthUser, ComplexQuery, ResolveEntity} from '@stemy/nest-utils';

import {UserDoc} from '../users/user.schema';
import {Manager, ManagerDoc} from './manager.schema';
import {AddManagerDto, EditManagerDto, ListManagerDto} from './manager.dto';
import {ManagersService} from './managers.service';

@Controller('managers')
export class ManagersController {

    constructor(protected managers: ManagersService) {
    }

    @Get()
    @ApiExtraModels(ListManagerDto)
    async list(@AuthUser() authUser: UserDoc,
               @Query('page') page: number = 0,
               @Query('limit') limit: number = 20,
               @Query('sort') sort: string = '',
               @ComplexQuery() q: ListManagerDto) {
        return await this.managers.paginate(
            q.toQuery(authUser),
            {page, limit, sort}
        );
    }

    @Get('/new/default')
    async getDefault() {
        return new AddManagerDto();
    }

    @Post()
    async add(@AuthUser() authUser: UserDoc, @Body() dto: AddManagerDto) {
        let manager: ManagerDoc = null;
        try {
            manager = this.managers.create(dto);
            manager.role = authUser.role;
            manager.host = authUser._id;
            await manager.save();
        } catch (e) {
            throw new BadRequestException(`${e}`);
        }
        return manager.toJSON();
    }

    @Get('/:id')
    async get(@ResolveEntity(Manager) manager: ManagerDoc) {
        return manager.toJSON();
    }

    @Patch('/:id')
    async update(@ResolveEntity(Manager) manager: ManagerDoc, @Body() dto: EditManagerDto) {
        try {
            await this.managers.update(manager, dto);
        } catch (e) {
            throw new BadRequestException(`${e}`);
        }
        return manager.toJSON();
    }

    @Delete('/:id')
    async delete(@ResolveEntity(Manager) manager: ManagerDoc) {
        return this.managers.delete(manager);
    }
}
