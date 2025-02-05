import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument, Types} from 'mongoose';
import {ObjectId} from 'mongodb';
import {createTransformer} from '@stemy/nest-utils';
import {User} from '../users/user.schema';
import {Channel} from '../channels/channel.schema';

export enum DeviceSizing {
    Fit = 'fit',
    Fill = 'fill'
}

export enum DeviceTransition {
    Normal = 'normal',
    Parallax = 'parallax',
    ScaleFade = 'scaleFade',
    Rotate = 'rotate',
    Circular = 'circular'
}

export class DeviceAddress {

    @Prop()
    address: string;

    @Prop()
    lat: number;

    @Prop()
    lng: number;

    @Prop()
    countryCode: string;
}


export class DeviceCoords {

    @Prop()
    x: number;

    @Prop()
    y: number;
}

export class DeviceSettings {

    @Prop({type: () => DeviceCoords, required: false})
    offset: DeviceCoords;

    @Prop({type: () => DeviceCoords, required: false})
    resolution: DeviceCoords;

    @Prop({enum: DeviceSizing, required: false})
    sizing: DeviceSizing;

    @Prop({enum: DeviceTransition, required: false})
    transition: DeviceTransition;

    @Prop({required: false})
    background: string;
}

export class DeviceScreenInfo {

    @Prop({required: false})
    manufacturer: string;

    @Prop({required: false})
    model: string;

    @Prop({required: false})
    size: string;

    @Prop({required: false})
    screenResolution: string;

    @Prop({required: false})
    contentResolution: string;
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

    @Prop({type: () => DeviceSettings, required: false})
    settings: DeviceSettings;

    @Prop({type: () => DeviceScreenInfo, required: false})
    screenInfo: DeviceScreenInfo;

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
