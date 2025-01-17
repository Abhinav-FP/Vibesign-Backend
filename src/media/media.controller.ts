import {BadRequestException, Body, Controller, Delete, Get, Patch, Post, Query} from '@nestjs/common';
import {ApiExtraModels} from '@nestjs/swagger';
import {AuthUser, ComplexQuery, ResolveEntity} from '@stemy/nest-utils';
import {ObjectId} from 'mongodb';

import {AddMediaDto, EditMediaDto, ListMediaDto} from './media.dto';
import {MediaDir, MediaDirDoc} from './media-dir.schema';
import {Media, MediaDoc} from './media.schema';
import {UserDoc} from '../users/user.schema';
import {MediaService} from './media.service';

interface IMediaItem {
    id?: string;
    name: string;
    type?: 'directory' | 'file';
    mimeType?: string;
    ext?: string;
    owner?: string | ObjectId;
    parent?: string | ObjectId;
    file?: string;
    preview?: string;
}

@Controller('media/:mediaDirId')
export class MediaController {

    constructor(protected media: MediaService) {
    }

    @Get()
    @ApiExtraModels(ListMediaDto)
    async list(@AuthUser() authUser: UserDoc,
               @ResolveEntity(MediaDir, false) dir: MediaDirDoc,
               @Query('page') page: number = 0,
               @Query('limit') limit: number = 20,
               @Query('sort') sort: string = '',
               @ComplexQuery() q: ListMediaDto) {
        const dirs = await this.media.findDirs(q.toQuery(authUser, dir?._id, false), sort);
        const res = await this.media.paginateMedia(
            q.toQuery(authUser, dir?._id, true),
            {page, limit, sort}
        );
        const items = [
            ...dirs.map(i => i.toJSON()),
            ...res.items.map(i => i.toJSON())
        ] as IMediaItem[];
        if (dir) {
            items.unshift({
                id: dir.parent?.toHexString() ?? `root`,
                name: '..',
                type: 'directory',
                owner: authUser.id,
            });
        }
        return {
            ...res,
            items,
            meta: {
                parent: dir?.parent?.toHexString() ?? `root`,
                path: !dir ? `/` : await dir.getPath()
            }
        };
    }

    @Get('/new/default')
    async getDefault(@ResolveEntity(MediaDir, false) dir: MediaDirDoc) {
        const res = new AddMediaDto();
        res.path = !dir ? `/` : await dir.getPath();
        return res;
    }

    @Post()
    async add(@AuthUser() authUser: UserDoc,
              @ResolveEntity(MediaDir, false) dir: MediaDirDoc,
              @Body() dto: AddMediaDto) {
        await this.media.generatePreview(dto);
        const media = this.media.createMedia(dto);
        try {
            media.parent = dir?._id;
            media.owner = authUser._id;
            await media.save();
        } catch (e) {
            throw new BadRequestException(`${e}`);
        }
        return media.toJSON();
    }

    @Get('/:id')
    async get(@ResolveEntity(MediaDir, false) dir: MediaDirDoc,
              @ResolveEntity(Media) media: MediaDoc) {
        const res = media.toJSON();
        res['path'] = !dir ? `/` : await dir.getPath();
        return res;
    }

    @Patch('/:id')
    async update(@ResolveEntity(MediaDir, false) dir: MediaDirDoc,
                 @ResolveEntity(Media) media: MediaDoc,
                 @Body() dto: EditMediaDto) {
        try {
            dto.parent = dir?._id ?? null;
            await this.media.updateMedia(media, dto);
        } catch (e) {
            throw new BadRequestException(`${e}`);
        }
        return media.toJSON();
    }

    @Delete('/:id')
    async delete(@ResolveEntity(Media) media: MediaDoc) {
        return this.media.deleteMedia(media);
    }
}
