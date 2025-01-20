import {registerAs} from '@nestjs/config';
import {IAssetModuleOpts, AssetGridDriver} from '@stemy/nest-utils';
import {CompressionAssetProcessorService} from '../misc/compression-asset-processor.service';
import {AssetFileTypeService} from '../misc/file-type.service';

export default registerAs('assets', () => ({
    maxSize: Number.MAX_SAFE_INTEGER,
    driver: AssetGridDriver,
    assetProcessor: CompressionAssetProcessorService,
    typeDetector: AssetFileTypeService,
} as IAssetModuleOpts));
