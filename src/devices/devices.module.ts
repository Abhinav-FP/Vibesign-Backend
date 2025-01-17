import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {AssetsModule} from '@stemy/nest-utils';

import {Device, DeviceSchema} from './device.schema';

import {DevicesService} from './devices.service';
import {DevicesController} from './devices.controller';
import {Channel, ChannelSchema} from '../channels/channel.schema';
import {Activity, ActivitySchema} from '../activities/activity.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: Channel.name, schema: ChannelSchema},
            {name: Device.name, schema: DeviceSchema},
            {name: Activity.name, schema: ActivitySchema},
        ]),
        AssetsModule
    ],
    controllers: [DevicesController],
    providers: [DevicesService],
    exports: [DevicesService]
})
export class DevicesModule {
}
