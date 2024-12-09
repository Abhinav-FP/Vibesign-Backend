import {Model} from 'mongoose';
import {Body, Controller, Delete, Get, Patch, Post, Query} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {AuthUser, paginate, QueryPipe, ResolveEntity} from '@stemy/nest-utils';

import {AddMediaDto, EditMediaDto, ListMediaDto} from '../dtos/media.dto';
import {MediaDir, MediaDirDoc} from "../schemas/media-dir.schema";
import {Media, MediaDoc} from '../schemas/media.schema';
import {UserDoc} from '../schemas/user.schema';

@Controller('media/:mediaDirId')
export class MediaController {

    constructor(@InjectModel(MediaDir.name) protected dirModel: Model<MediaDir>,
                @InjectModel(Media.name) protected model: Model<Media>) {
    }

    @Get()
    async list(@AuthUser() authUser: UserDoc,
               @ResolveEntity(MediaDir, false) dir: MediaDirDoc,
               @Query('page') page: number = 0,
               @Query('limit') limit: number = 20,
               @Query('sort') sort: string = '',
               @Query('query', QueryPipe) q: ListMediaDto) {
        const query = q.toQuery(authUser);
        query.parent = dir?.id;
        const dirs = await this.dirModel.find(query);
        const res = await paginate(this.model, query, {page, limit, sort});
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

    @Get('/:id')
    async get(@ResolveEntity(MediaDir, false) dir: MediaDirDoc,
              @ResolveEntity(Media) media: MediaDoc) {
        const res = media.toJSON();
        res['path'] = !dir ? `/` : await dir.getPath();
        return res;
    }

    @Post()
    async add(@AuthUser() authUser: UserDoc,
              @ResolveEntity(MediaDir, false) dir: MediaDirDoc,
              @Body() dto: AddMediaDto) {
        const media = new this.model(dto);
        media.parent = dir?.id;
        media.owner = authUser.id;
        await media.save();
        return media.toJSON();
    }

    @Patch('/:id')
    async update(@ResolveEntity(Media) media: MediaDoc, @Body() dto: EditMediaDto) {
        await media.updateOne(dto);
        return media.toJSON();
    }

    @Delete('/:id')
    async delete(@ResolveEntity(Media) media: MediaDoc) {
        return media.deleteOne();
    }
}
