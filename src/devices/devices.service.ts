import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {FilterQuery, Model} from 'mongoose';
import {IPagination, IPaginationParams, paginate, setAndUpdate} from '@stemy/nest-utils';

import {AddDeviceDto, EditDeviceDto} from './dtos/device.dto';
import {Device, DeviceDoc} from './schemas/device.schema';
import {Channel, ChannelDoc} from '../channels/schemas/channel.schema';
import {UserDoc} from '../schemas/user.schema';

@Injectable()
export class DevicesService {

    constructor(@InjectModel(Channel.name) protected channelModel: Model<Channel>,
                @InjectModel(Device.name) protected model: Model<Device>) {
    }

    listChannels(owner: UserDoc): Promise<ChannelDoc[]> {
        return this.channelModel.find({ owner: owner._id });
    }

    paginate(query: FilterQuery<DeviceDoc>, params: IPaginationParams<Device>): Promise<IPagination<DeviceDoc>> {
        return paginate(this.model, query, params);
    }

    create(dto: AddDeviceDto): DeviceDoc {
        return new this.model(dto);
    }

    update(channel: DeviceDoc, dto: EditDeviceDto) {
        return setAndUpdate(channel, dto);
    }

    async delete(channel: DeviceDoc): Promise<any> {
        if (!channel) return null;
        return channel.deleteOne();
    }
}
