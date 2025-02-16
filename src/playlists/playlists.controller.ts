import {BadRequestException, Body, Controller, Delete, Get, Patch, Post, Query} from '@nestjs/common';
import {ApiExtraModels} from '@nestjs/swagger';
import {AuthUser, ComplexQuery, ResolveEntity} from '@stemy/nest-utils';

import {UserDoc} from '../users/user.schema';
import {Playlist, PlaylistDoc} from './playlist.schema';
import {AddPlaylistDto, EditPlaylistDto, ListPlaylistDto} from './playlist.dto';
import {PlaylistsService} from './playlists.service';

@Controller('playlists')
export class PlaylistsController {

    constructor(protected playlists: PlaylistsService) {
    }

    @Get()
    @ApiExtraModels(ListPlaylistDto)
    async list(@AuthUser() authUser: UserDoc,
               @Query('page') page: number = 0,
               @Query('limit') limit: number = 20,
               @Query('sort') sort: string = '',
               @ComplexQuery() q: ListPlaylistDto) {
        return await this.playlists.paginate(
            q.toQuery(authUser),
            {page, limit, sort, populate: ['media']}
        );
    }

    @Get('media')
    async getMedia(@AuthUser() authUser: UserDoc) {
        return this.playlists.listMedias(authUser);
    }

    @Get('new/default')
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

    @Get(':id')
    async get(@ResolveEntity(Playlist) playlist: PlaylistDoc) {
        return playlist.toJSON();
    }

    @Patch(':id')
    async update(@ResolveEntity(Playlist) playlist: PlaylistDoc, @Body() dto: EditPlaylistDto) {
        try {
            await this.playlists.update(playlist, dto);
        } catch (e) {
            throw new BadRequestException(`${e}`);
        }
        return playlist.toJSON();
    }

    @Delete(':id')
    async delete(@ResolveEntity(Playlist) playlist: PlaylistDoc) {
        return this.playlists.delete(playlist);
    }
}
