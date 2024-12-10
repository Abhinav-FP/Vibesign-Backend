import {Body, Controller, Delete, Get, Patch, Post, Query} from '@nestjs/common';
import {AuthUser, QueryPipe, ResolveEntity} from '@stemy/nest-utils';

import {AddMediaDto, EditMediaDto, ListMediaDto} from '../dtos/media.dto';
import {MediaDir, MediaDirDoc} from "./schemas/media-dir.schema";
import {Media, MediaDoc} from './schemas/media.schema';
import {UserDoc} from '../schemas/user.schema';
import {MediaService} from "./media.service";

@Controller('media/:mediaDirId')
export class MediaController {

    constructor(protected media: MediaService) {
    }

    @Get()
    async list(@AuthUser() authUser: UserDoc,
               @ResolveEntity(MediaDir, false) dir: MediaDirDoc,
               @Query('page') page: number = 0,
               @Query('limit') limit: number = 20,
               @Query('sort') sort: string = '',
               @Query('query', QueryPipe) q: ListMediaDto) {
        const query = q.toQuery(authUser);
        query.parent = dir?._id;
        const dirs = await this.media.findDirs(query, sort);
        const res = await this.media.paginateMedia(query, {page, limit, sort});
        return {
            ...res,
            items: [
                ...dirs.map(i => i.toJSON()),
                ...res.items.map(i => i.toJSON())
            ],
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
        media.parent = dir?._id;
        media.owner = authUser._id;
        await media.save();
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
        dto.parent = dir?._id;
        await this.media.replaceFile(media, dto);
        await media.updateOne(dto);
        return media.toJSON();
    }

    @Delete('/:id')
    async delete(@ResolveEntity(Media) media: MediaDoc) {
        return this.media.deleteMedia(media);
    }
}
