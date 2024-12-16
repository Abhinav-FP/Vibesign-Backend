import {BadRequestException, Body, Controller, Delete, Get, Patch, Post, Query} from '@nestjs/common';
import {AuthUser, QueryPipe, ResolveEntity} from '@stemy/nest-utils';

import {UserDoc} from '../schemas/user.schema';
import {Playlist, PlaylistDoc} from './schemas/playlist.schema';
import {AddPlaylistDto, EditPlaylistDto, ListPlaylistDto} from './dtos/playlist.dto';
import {PlaylistsService} from "./playlists.service";

@Controller('playlists')
export class PlaylistsController {

    constructor(protected playlists: PlaylistsService) {
    }

    @Get()
    async list(@AuthUser() authUser: UserDoc,
               @Query('page') page: number = 0,
               @Query('limit') limit: number = 20,
               @Query('sort') sort: string = '',
               @Query('query', QueryPipe) q: ListPlaylistDto) {
        return await this.playlists.paginate(
            q.toQuery(authUser),
            {page, limit, sort}
        );
    }

    @Get('/media')
    async getMedia(@AuthUser() authUser: UserDoc) {
        return this.playlists.listMedias(authUser);
    }

    @Get('/new/default')
    async getDefault() {
        return new AddPlaylistDto();
    }

    @Post()
    async add(@AuthUser() authUser: UserDoc, @Body() dto: AddPlaylistDto) {
        const playlist = this.playlists.create(dto);
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
        console.log(playlist, dto);
        return playlist.toJSON();
    }

    @Delete('/:id')
    async delete(@ResolveEntity(Playlist) playlist: PlaylistDoc) {
        return this.playlists.delete(playlist);
    }
}
