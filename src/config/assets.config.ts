import {registerAs} from '@nestjs/config';
import {IAssetModuleOpts, AssetGridDriver} from '@stemy/nest-utils';
import {CompressionAssetProcessorService} from '../dashboard/services/compression-asset-processor.service';
import {AssetFileTypeService} from '../dashboard/services/file-type.service';

export default registerAs('assets', () => ({
    maxSize: parseInt(process.env.MAX_FILE_SIZE || '262144000'),
    assetProcessor: CompressionAssetProcessorService,
    typeDetector: AssetFileTypeService,
    driver: AssetGridDriver
} as IAssetModuleOpts));
