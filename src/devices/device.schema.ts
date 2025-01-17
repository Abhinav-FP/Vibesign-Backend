import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument, Types} from 'mongoose';
import {ObjectId} from 'mongodb';
import {createTransformer} from '@stemy/nest-utils';
import {User} from '../users/user.schema';
import {Channel} from '../channels/channel.schema';

export class DeviceAddress {

    @Prop()
    address: string;

    @Prop()
    lat: number;

    @Prop()
    lng: number;
}

@Schema({
    id: true,
    timestamps: { createdAt: true, updatedAt: true },
    toJSON: {
        transform: createTransformer()
    }
})
export class Device {
    @Prop()
    name: string;

    @Prop({unique: true})
    hexCode: string;

    @Prop()
    active: boolean;

    @Prop({type: () => DeviceAddress})
    address: DeviceAddress;

    @Prop({type: Types.ObjectId, required: false, ref: User.name})
    owner: ObjectId;

    @Prop({type: Types.ObjectId, required: false, ref: Channel.name})
    channel: ObjectId;
}

export type DeviceDoc = HydratedDocument<Device>;

export const DeviceSchema = SchemaFactory.createForClass(Device);

DeviceSchema.index({name: 1, owner: 1}, { unique: true });
