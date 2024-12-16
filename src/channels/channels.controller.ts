import {BadRequestException, Body, Controller, Delete, Get, Patch, Post, Query} from '@nestjs/common';
import {AuthUser, QueryPipe, ResolveEntity} from '@stemy/nest-utils';

import {UserDoc} from '../schemas/user.schema';
import {Channel, ChannelDoc} from './schemas/channel.schema';
import {AddChannelDto, EditChannelDto, ListChannelDto} from './dtos/channel.dto';
import {ChannelsService} from "./channels.service";

@Controller('channels')
export class ChannelsController {

    constructor(protected channels: ChannelsService) {
    }

    @Get()
    async list(@AuthUser() authUser: UserDoc,
               @Query('page') page: number = 0,
               @Query('limit') limit: number = 20,
               @Query('sort') sort: string = '',
               @Query('query', QueryPipe) q: ListChannelDto) {
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
        const playlist = this.channels.create(dto);
        try {
            playlist.owner = authUser._id;
            await playlist.save();
        } catch (e) {
            throw new BadRequestException(`${e}`);
        }
        return playlist.toJSON();
    }

    @Get('/:id')
    async get(@ResolveEntity(Channel) channel: ChannelDoc) {
        return channel.toJSON();
    }

    @Patch('/:id')
    async update(@ResolveEntity(Channel) channel: ChannelDoc, @Body() dto: EditChannelDto) {
        await this.channels.update(channel, dto);
        return channel.toJSON();
    }

    @Delete('/:id')
    async delete(@ResolveEntity(Channel) channel: ChannelDoc) {
        return this.channels.delete(channel);
    }
}
