import {Module} from '@nestjs/common';

import {AuthController} from './auth.controller';
import {AssetFileTypeService} from './file-type.service';
import {CompressionAssetProcessorService} from './compression-asset-processor.service';

@Module({
    imports: [],
    providers: [
        AssetFileTypeService,
        CompressionAssetProcessorService
    ],
    controllers: [AuthController]
})
export class MiscModule {
}
