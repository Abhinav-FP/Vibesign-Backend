import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';

import {AuthController} from './auth.controller';
import {AssetFileTypeService} from './file-type.service';
import {CompressionAssetProcessorService} from './compression-asset-processor.service';

import {Channel, ChannelSchema} from '../channels/channel.schema';
import {Device, DeviceSchema} from '../devices/device.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: Channel.name, schema: ChannelSchema},
            {name: Device.name, schema: DeviceSchema},
        ]),
    ],
    providers: [
        AssetFileTypeService,
        CompressionAssetProcessorService
    ],
    controllers: [AuthController]
})
export class MiscModule {
}
