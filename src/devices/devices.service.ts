import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {EventEmitter2} from '@nestjs/event-emitter';
import {FilterQuery, Model, Types} from 'mongoose';
import {IPagination, IPaginationParams, paginate, setAndUpdate} from '@stemy/nest-utils';

import {DeviceUpdated} from '../events/device-updated';
import {UserDoc} from '../users/user.schema';
import {Channel, ChannelDoc} from '../channels/channel.schema';
import {AddActivityDto} from '../activities/activity.dto';
import {Activity, ActivityDoc, Location} from '../activities/activity.schema';
import {AddDeviceDto, EditDeviceDto} from './device.dto';
import {Device, DeviceDoc} from './device.schema';

@Injectable()
export class DevicesService {

    constructor(@InjectModel(Channel.name) protected channelModel: Model<Channel>,
                @InjectModel(Activity.name) protected activityModel: Model<Activity>,
                @InjectModel(Device.name) protected model: Model<Device>,
                private eventEmitter: EventEmitter2) {
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
        this.eventEmitter.emit(DeviceUpdated.name, new DeviceUpdated(device, device.hexCode));
        return device.save();
    }

    async update(device: DeviceDoc, dto: EditDeviceDto) {
        const hexCode = device.hexCode;
        device = await setAndUpdate(device, dto);
        this.eventEmitter.emit(DeviceUpdated.name, new DeviceUpdated(device, hexCode));
        return device;
    }

    async createActivity(dto: AddActivityDto, device: DeviceDoc): Promise<ActivityDoc> {
        const activity = new this.activityModel(dto);
        const {address, lat, lng} = device.address || {address: 'Unknown', lat: 0, lng: 0};
        activity.name = device.name;
        activity.location = activity.location || new Location(lat, lng);
        activity.address = activity.address || address;
        activity.owner = device.owner;
        activity.device = device._id;
        await activity.save();
        const now = new Date();
        await this.activityModel.deleteMany({
            _id: {$ne: activity._id},
            device: device._id,
            createdAt: {$lte: new Date(now.getTime() - 3600 * 1000)}
        });
        return activity;
    }

    async delete(channel: DeviceDoc): Promise<any> {
        if (!channel) return null;
        return channel.deleteOne();
    }
}
