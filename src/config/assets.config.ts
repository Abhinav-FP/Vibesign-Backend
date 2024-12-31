import {registerAs} from '@nestjs/config';
import {IAssetModuleOpts} from '@stemy/nest-utils';
import {CompressionAssetProcessorService} from '../services/compression-asset-processor.service';
import {AssetFileTypeService} from '../services/file-type.service';

export default registerAs('assets', () => ({
    assetProcessor: CompressionAssetProcessorService,
    typeDetector: AssetFileTypeService,
} as IAssetModuleOpts));
