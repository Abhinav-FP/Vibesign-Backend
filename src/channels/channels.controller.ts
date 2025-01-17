import {BadRequestException, Body, Controller, Delete, Get, Patch, Post, Query} from '@nestjs/common';
import {AuthUser, ComplexQuery, ResolveEntity} from '@stemy/nest-utils';

import {UserDoc} from '../users/user.schema';
import {Channel, ChannelDoc} from './channel.schema';
import {AddChannelDto, EditChannelDto, ListChannelDto} from './channel.dto';
import {ChannelsService} from './channels.service';
import {ApiExtraModels} from '@nestjs/swagger';

@Controller('channels')
export class ChannelsController {

    constructor(protected channels: ChannelsService) {
    }

    @Get()
    @ApiExtraModels(ListChannelDto)
    async list(@AuthUser() authUser: UserDoc,
               @Query('page') page: number = 0,
               @Query('limit') limit: number = 20,
               @Query('sort') sort: string = '',
               @ComplexQuery() q: ListChannelDto) {
        return await this.channels.paginate(
            q.toQuery(authUser),
            {page, limit, sort}
        );
    }

    @Get('/playlists')
    async getPlaylists(@AuthUser() authUser: UserDoc) {
        return this.channels.listPlaylists(authUser);
    }

    @Get('/new/default')
    async getDefault() {
        return new AddChannelDto();
    }

    @Post()
    async add(@AuthUser() authUser: UserDoc, @Body() dto: AddChannelDto) {
        const channel = this.channels.create(dto);
        try {
            channel.owner = authUser._id;
            await channel.save();
        } catch (e) {
            throw new BadRequestException(`${e}`);
        }
        return channel.toJSON();
    }

    @Get('/:id')
    async get(@ResolveEntity(Channel) channel: ChannelDoc) {
        return channel.toJSON();
    }

    @Patch('/:id')
    async update(@ResolveEntity(Channel) channel: ChannelDoc, @Body() dto: EditChannelDto) {
        try {
            await this.channels.update(channel, dto);
        } catch (e) {
            throw new BadRequestException(`${e}`);
        }
        return channel.toJSON();
    }

    @Delete('/:id')
    async delete(@ResolveEntity(Channel) channel: ChannelDoc) {
        return this.channels.delete(channel);
    }
}
