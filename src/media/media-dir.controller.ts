import {BadRequestException, Body, Controller, Delete, Get, Patch, Post} from '@nestjs/common';
import {AuthUser, ResolveEntity} from '@stemy/nest-utils';

import {MediaDir, MediaDirDoc} from './schemas/media-dir.schema';
import {UserDoc} from '../schemas/user.schema';
import {AddMediaDirDto, EditMediaDirDto} from './dtos/media-dir.dto';
import {MediaService} from "./media.service";

@Controller('media-dir/:parentId')
export class MediaDirController {

    constructor(protected media: MediaService) {
    }

    @Get('/new/default')
    async getDefault(@ResolveEntity(MediaDir, false, 'parentId') parent: MediaDirDoc) {
        const res = new AddMediaDirDto();
        res.path = !parent ? `/` : await parent.getPath();
        return res;
    }

    @Post()
    async add(@AuthUser() authUser: UserDoc,
              @ResolveEntity(MediaDir, false, 'parentId') parent: MediaDirDoc,
              @Body() dto: AddMediaDirDto) {
        const dir = this.media.createDir(dto);
        try {
            dir.parent = parent?._id;
            dir.owner = authUser._id;
            await dir.save();
        } catch (e) {
            throw new BadRequestException(`${e}`);
        }
        return dir.toJSON();
    }

    @Get('/:id')
    async get(@ResolveEntity(MediaDir, false, 'parentId') parent: MediaDirDoc,
              @ResolveEntity(MediaDir) dir: MediaDirDoc) {
        const res = dir.toJSON();
        res['path'] = !parent ? `/` : await parent.getPath();
        return res;
    }

    @Patch('/:id')
    async update(@ResolveEntity(MediaDir, false, 'parentId') parent: MediaDirDoc,
                 @ResolveEntity(MediaDir) dir: MediaDirDoc,
                 @Body() dto: EditMediaDirDto) {
        try {
            dto.parent = parent?._id ?? null;
            await this.media.updateDir(dir, dto);
        } catch (e) {
            throw new BadRequestException(`${e}`);
        }
        return dir.toJSON();
    }

    @Delete('/:id')
    async delete(@ResolveEntity(MediaDir) dir: MediaDirDoc) {
        return this.media.deleteDir(dir);
    }
}
