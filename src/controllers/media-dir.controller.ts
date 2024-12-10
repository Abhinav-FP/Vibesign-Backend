import {Model} from 'mongoose';
import {Body, Controller, Delete, Get, Patch, Post} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {AuthUser, ResolveEntity} from '@stemy/nest-utils';

import {MediaDir, MediaDirDoc} from '../schemas/media-dir.schema';
import {Media} from '../schemas/media.schema';
import {UserDoc} from '../schemas/user.schema';
import {AddMediaDirDto, EditMediaDirDto} from '../dtos/media-dir.dto';

@Controller('media-dir/:parentId')
export class MediaDirController {

    constructor(@InjectModel(MediaDir.name) protected model: Model<MediaDir>,
                @InjectModel(Media.name) protected mediaModel: Model<Media>) {
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
        const dir = new this.model(dto);
        dir.parent = parent?.id;
        dir.owner = authUser.id;
        await dir.save();
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
                 @ResolveEntity(MediaDir) media: MediaDirDoc,
                 @Body() dto: EditMediaDirDto) {
        dto.parent = parent?.id;
        await media.updateOne(dto);
        return media.toJSON();
    }

    @Delete('/:id')
    async delete(@ResolveEntity(MediaDir) dir: MediaDirDoc) {
        return this.deleteRecursive(dir);
    }

    protected async deleteRecursive(dir: MediaDirDoc) {
        const subDirs = await this.model.find({parent: dir.id});
        const subMedia = await this.mediaModel.find({parent: dir.id});
        await Promise.all(subDirs.map(d => this.deleteRecursive(d)));
        await Promise.all(subMedia.map(m => m.deleteOne()));
        return dir.deleteOne();
    }
}
