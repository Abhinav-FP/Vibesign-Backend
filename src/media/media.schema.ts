import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument, Types} from 'mongoose';
import {ObjectId} from 'mongodb';
import {createTransformer} from '@stemy/nest-utils';

import {User} from '../users/user.schema';
import {MediaDir} from './media-dir.schema';

export enum MediaType {
    File = 'file',
    Weather = 'weather'
}

export enum ForecastDays {
    Current = 0,
    ThreeDays = 3,
    FiveDays = 5,
}

export enum ForecastUnits {
    Metric = 'metric',
    Us = 'us',
    Uk = 'uk',
}

export class MediaAddress {

    @Prop()
    address: string;

    @Prop()
    lat: number;

    @Prop()
    lng: number;

    @Prop()
    countryCode: string;
}

@Schema({
    id: true,
    timestamps: { createdAt: true, updatedAt: true },
    toJSON: {
        transform: createTransformer((_, ret) => {
            ret.type = 'file';
            ret.playbackType = ret.mediaType === 'weather'
                ? 'weather'
                : (ret.mimeType?.startsWith('video') ? 'video' : 'image');
        })
    }
})
export class Media {

    @Prop()
    name: string;

    @Prop({enum: MediaType})
    mediaType: MediaType;

    @Prop()
    duration: number;

    @Prop({type: Types.ObjectId, required: false})
    file: ObjectId;

    @Prop({type: Types.ObjectId, required: false})
    template: ObjectId;

    @Prop({type: Types.ObjectId, required: false})
    preview: ObjectId;

    @Prop({required: false})
    mimeType: string;

    @Prop({required: false})
    ext: string;

    @Prop({required: false, enum: ForecastDays})
    forecastDays: ForecastDays;

    @Prop({required: false, enum: ForecastUnits})
    forecastUnits: ForecastUnits;

    @Prop({required: false})
    forecastLocale: string;

    @Prop({type: () => MediaAddress})
    address: MediaAddress;

    @Prop({type: Types.ObjectId, required: false, ref: MediaDir.name})
    parent: ObjectId;

    @Prop({type: Types.ObjectId, required: false, ref: User.name})
    owner: ObjectId;
}

export type MediaDoc = HydratedDocument<Media>;

export const MediaSchema = SchemaFactory.createForClass(Media);

MediaSchema.index({name: 1, parent: 1, owner: 1}, { unique: true });
