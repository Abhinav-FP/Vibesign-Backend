import {Readable} from 'stream';
import {createReadStream} from 'fs';
import * as ffmpeg from 'fluent-ffmpeg';
import {Injectable} from '@nestjs/common';
import {AssetProcessorService, IAssetMeta, IFileType, streamToBuffer, tempPath} from '@stemy/nest-utils';

export async function compress(metadata: IAssetMeta) {
    const output = await tempPath('compressed.mp4');
    const ratio = 1080 / metadata.height;
    const width = ratio < 1 ? metadata.width * ratio : metadata.width;
    const height = ratio < 1 ? metadata.height * ratio : metadata.height;
    const minBitrate = 3000_000;
    const bitrate = Math.min((isNaN(metadata.bit_rate) ? minBitrate : metadata.bit_rate), minBitrate) / 1000;
    return new Promise<Readable>((resolve, reject) => {
        ffmpeg(metadata.tempFfmpegPath)
            .output(output)
            .outputOptions("-preset superfast")
            .videoCodec('libx264')
            .size(`${width}x${height}`)
            .fps(25)
            .videoBitrate(`${bitrate}k`)
            .on('end', () => {
                resolve(createReadStream(output));
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

    async process(buffer: Buffer, metadata: IAssetMeta, fileType: IFileType): Promise<Buffer> {
        buffer = await super.process(buffer, metadata, fileType);
        if (AssetProcessorService.isVideo(fileType.mime)) {
            const compressed = await compress(metadata);
            buffer = await streamToBuffer(compressed);
            await AssetProcessorService.copyVideoMeta(buffer, metadata);
        }
        return buffer;
    }
}
