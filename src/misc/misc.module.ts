import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';

import {AuthController} from './auth.controller';
import {AssetFileTypeService} from './file-type.service';
import {CompressionAssetProcessorService} from './compression-asset-processor.service';
import {SocketGateway} from './socket-gateway';

import {Channel, ChannelSchema} from '../channels/channel.schema';
import {Device, DeviceSchema} from '../devices/device.schema';
import {Activity, ActivitySchema} from '../activities/activity.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: Channel.name, schema: ChannelSchema},
            {name: Device.name, schema: DeviceSchema},
            {name: Activity.name, schema: ActivitySchema},
        ]),
    ],
    providers: [
        AssetFileTypeService,
        CompressionAssetProcessorService,
        SocketGateway
    ],
    controllers: [AuthController]
})
export class MiscModule {
}
