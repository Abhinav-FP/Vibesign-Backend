import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {FilterQuery, Model} from 'mongoose';
import {AssetsService, IPagination, IPaginationParams, paginate} from '@stemy/nest-utils';

import {MediaDir, MediaDirDoc} from './schemas/media-dir.schema';
import {Media, MediaDoc} from './schemas/media.schema';
import {AddMediaDirDto} from '../dtos/media-dir.dto';
import {MediaDto} from '../dtos/media.dto';

@Injectable()
export class MediaService {

    constructor(readonly assets: AssetsService,
                @InjectModel(MediaDir.name) protected dirModel: Model<MediaDir>,
                @InjectModel(Media.name) protected mediaModel: Model<Media>) {
    }

    findDirs(query: FilterQuery<MediaDirDoc>): Promise<MediaDirDoc[]> {
        return this.dirModel.find(query);
    }

    paginateMedia(query: FilterQuery<MediaDoc>, params: IPaginationParams<Media>): Promise<IPagination<MediaDoc>> {
        return paginate(this.mediaModel, query, params);
    }

    createDir(dto: AddMediaDirDto): MediaDirDoc {
        return new this.dirModel(dto);
    }

    createMedia(dto: AddMediaDirDto): MediaDoc {
        return new this.mediaModel(dto);
    }

    async replaceFile(media: MediaDoc, dto: MediaDto): Promise<MediaDoc> {
        if (media.file == dto.file) return;
        console.log('unlinking', media.file, media.preview);
        await this.assets.unlink(media.file);
        await this.assets.unlink(media.preview);
        await this.generatePreview(dto);
    }

    async generatePreview(dto: MediaDto): Promise<void> {
        if (!dto.file) {
            return;
        }
        const asset = await this.assets.read(dto.file);
        if (!asset) {
            dto.preview = null;
            return;
        }
        let {width, height} = asset.metadata;
        const size = 128;
        const ratio = Math.max(size / width, size / height);
        width *= ratio;
        height *= ratio;
        const image = await asset.getImage({
            scaleX: ratio,
            scaleY: ratio,
            cropAfter: {
                x: (width - size) / 2,
                y: (height - size) / 2,
                w: size,
                h: size,
            }
        });
        const preview = await this.assets.writeStream(image);
        dto.preview = preview.oid;
    }

    async deleteDir(dir: MediaDirDoc): Promise<any> {
        if (!dir) return;
        const subDirs = await this.dirModel.find({parent: dir._id});
        const subMedia = await this.mediaModel.find({parent: dir._id});
        await Promise.all(subDirs.map(d => this.deleteDir(d)));
        await Promise.all(subMedia.map(m => this.deleteMedia(m)));
        return dir.deleteOne();
    }

    async deleteMedia(media: MediaDoc): Promise<any> {
        if (!media) return;
        await this.assets.unlink(media.file);
        await this.assets.unlink(media.preview);
        return media.deleteOne();
    }
}
