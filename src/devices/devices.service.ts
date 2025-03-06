import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {EventEmitter2} from '@nestjs/event-emitter';
import {FilterQuery, Model, Types} from 'mongoose';
import {IPagination, IPaginationParams, paginate, setAndUpdate} from '@stemy/nest-utils';

import {DeviceUpdated} from '../events/device-updated';
import {UserDoc} from '../users/user.schema';
import {Channel, ChannelDoc} from '../channels/channel.schema';
import {AddDeviceDto, EditDeviceDto} from './device.dto';
import {Device, DeviceDoc} from './device.schema';

@Injectable()
export class DevicesService {

    constructor(@InjectModel(Channel.name) protected channelModel: Model<Channel>,
                @InjectModel(Device.name) protected model: Model<Device>,
                protected eventEmitter: EventEmitter2) {
    }

    listChannels(owner: UserDoc): Promise<ChannelDoc[]> {
        return this.channelModel.find({ owner: owner._id });
    }

    paginate(query: FilterQuery<DeviceDoc>, params: IPaginationParams<Device>): Promise<IPagination<DeviceDoc>> {
        return paginate(this.model, query, params);
    }

    async add(dto: AddDeviceDto, owner: Types.ObjectId): Promise<DeviceDoc> {
        const device = new this.model(dto);
        device.owner = owner;
        this.eventEmitter.emit(DeviceUpdated.name, new DeviceUpdated(device));
        return device.save();
    }

    async update(device: DeviceDoc, dto: EditDeviceDto): Promise<DeviceDoc> {
        const hexCode = device.hexCode;
        device = await setAndUpdate(device, dto);
        this.eventEmitter.emit(DeviceUpdated.name, new DeviceUpdated(device, hexCode));
        return device;
    }

    async delete(device: DeviceDoc): Promise<any> {
        if (!device) return null;
        return device.deleteOne();
    }
}
