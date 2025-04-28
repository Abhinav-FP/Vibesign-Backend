import * as ffmpeg from 'fluent-ffmpeg';
import {Injectable} from '@nestjs/common';
import {AssetProcessorService, IAssetMeta, IFileType, IUploadedFile} from '@stemy/nest-utils';
import {join} from "path";

export async function compress(file: IUploadedFile, metadata: IAssetMeta, fileType: IFileType): Promise<IUploadedFile> {
    const path = join(file.destination, `${file.filename.replace(/\./, '-')}-conv.mp4`);
    const filename = path.replace(file.destination, '');
    const ratio = 1080 / metadata.height;
    const width = ratio < 1 ? metadata.width * ratio : metadata.width;
    const height = ratio < 1 ? metadata.height * ratio : metadata.height;
    const minBitrate = 2500_000;
    const bitrate = Math.min((isNaN(metadata.bit_rate) ? minBitrate : metadata.bit_rate), minBitrate) / 1000;
    const date = `cmp_${Date.now()}`;
    console.log(`Compressing`, bitrate, `${metadata.width}x${metadata.height}`, `${width}x${height}`, fileType);
    return new Promise((resolve, reject) => {
        console.time(date);
        ffmpeg(file.path)
            .output(path)
            .outputOptions("-preset ultrafast")
            .videoCodec('libx264')
            .size(`${width}x${height}`)
            .videoBitrate(`${bitrate}k`)
            .fps(20)
            .on('end', () => {
                resolve({...file, filename, path});
            })
            .on('progress', progress => {
                console.timeLog(date, `${progress.percent}%`);
            })
            .on('error', (err) => {
                console.log(err);
                reject(err);
            })
            .run();
    });
}

@Injectable()
export class CompressionAssetProcessorService extends AssetProcessorService {
    async process(file: IUploadedFile, metadata: IAssetMeta, fileType: IFileType): Promise<IUploadedFile> {
        file = await super.process(file, metadata, fileType);
        if (AssetProcessorService.isVideo(fileType.mime)) {
            const compressed = await compress(file, metadata, fileType);
            return await AssetProcessorService.copyVideoMeta(compressed, metadata);
        }
        return file;
    }
}
