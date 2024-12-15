import {BadRequestException, Body, Controller, Delete, Get, Patch, Post, Query} from '@nestjs/common';
import {AuthUser, QueryPipe, ResolveEntity} from '@stemy/nest-utils';

import {UserDoc} from '../schemas/user.schema';
import {Playlist, PlaylistDoc} from './schemas/playlist.schema';
import {AddPlaylistDto, EditPlaylistDto, ListPlaylistDto} from './dtos/playlist.dto';
import {PlaylistService} from "./playlist.service";

@Controller('playlist')
export class PlaylistController {

    constructor(protected playlist: PlaylistService) {
    }

    @Get()
    async list(@AuthUser() authUser: UserDoc,
               @Query('page') page: number = 0,
               @Query('limit') limit: number = 20,
               @Query('sort') sort: string = '',
               @Query('query', QueryPipe) q: ListPlaylistDto) {
        return await this.playlist.paginate(
            q.toQuery(authUser),
            {page, limit, sort}
        );
    }

    @Get('/media')
    async getMedia(@AuthUser() authUser: UserDoc) {
        return this.playlist.listMedias(authUser);
    }

    @Get('/new/default')
    async getDefault() {
        return new AddPlaylistDto();
    }

    @Post()
    async add(@AuthUser() authUser: UserDoc, @Body() dto: AddPlaylistDto) {
        const playlist = this.playlist.create(dto);
        try {
            playlist.owner = authUser._id;
            await playlist.save();
        } catch (e) {
            throw new BadRequestException(`${e}`);
        }
        return playlist.toJSON();
    }

    @Get('/:id')
    async get(@ResolveEntity(Playlist) playlist: PlaylistDoc) {
        return playlist.toJSON();
    }

    @Patch('/:id')
    async update(@ResolveEntity(Playlist) playlist: PlaylistDoc, @Body() dto: EditPlaylistDto) {
        await playlist.updateOne(dto);
        return playlist.toJSON();
    }

    @Delete('/:id')
    async delete(@ResolveEntity(Playlist) playlist: PlaylistDoc) {
        return this.playlist.delete(playlist);
    }
}
