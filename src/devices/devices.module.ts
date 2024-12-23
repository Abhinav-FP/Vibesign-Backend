import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {AssetsModule} from '@stemy/nest-utils';

import {Device, DeviceSchema} from './schemas/device.schema';

import {DevicesService} from './devices.service';
import {DevicesController} from './devices.controller';
import {Channel, ChannelSchema} from '../channels/schemas/channel.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: Channel.name, schema: ChannelSchema},
            {name: Device.name, schema: DeviceSchema},
        ]),
        AssetsModule
    ],
    controllers: [DevicesController],
    providers: [DevicesService],
    exports: [DevicesService]
})
export class DevicesModule {
}
