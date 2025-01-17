import {Injectable} from '@nestjs/common';
import {AssetProcessorService, IAssetMeta, IFileType} from '@stemy/nest-utils';

@Injectable()
export class CompressionAssetProcessorService extends AssetProcessorService {

    constructor() {
        super();
    }

    async process(buffer: Buffer, metadata: IAssetMeta, fileType: IFileType): Promise<Buffer> {
        buffer = await super.process(buffer, metadata, fileType);
        // if (fileType.mime?.startsWith('video')) {
        //
        //     return;
        // }
        return buffer;
    }
}
