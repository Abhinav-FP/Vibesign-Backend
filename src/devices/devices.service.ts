import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {FilterQuery, Model} from 'mongoose';
import {IPagination, IPaginationParams, paginate, setAndUpdate} from '@stemy/nest-utils';

import {AddDeviceDto, EditDeviceDto} from './dtos/device.dto';
import {Device, DeviceDoc} from './schemas/device.schema';
import {Channel, ChannelDoc} from '../channels/schemas/channel.schema';
import {Activity, ActivityDoc, Location} from '../activities/schemas/activity.schema';
import {UserDoc} from '../schemas/user.schema';
import {AddActivityDto} from "../activities/dtos/activity.dto";

@Injectable()
export class DevicesService {

    constructor(@InjectModel(Channel.name) protected channelModel: Model<Channel>,
                @InjectModel(Activity.name) protected activityModel: Model<Activity>,
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

    update(device: DeviceDoc, dto: EditDeviceDto) {
        return setAndUpdate(device, dto);
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
