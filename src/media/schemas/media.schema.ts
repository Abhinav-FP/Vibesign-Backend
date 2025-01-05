import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument, Types} from 'mongoose';
import {ObjectId} from 'mongodb';
import {createTransformer} from '@stemy/nest-utils';

import {User} from '../../schemas/user.schema';
import {MediaDir} from './media-dir.schema';

export enum MediaType {
    File = 'file',
    Weather = 'weather'
}

export class MediaAddress {

    @Prop()
    address: string;

    @Prop()
    lat: number;

    @Prop()
    lng: number;

    @Prop()
    utcOffset: number;
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

    @Prop({enum: MediaType, required: false})
    mediaType: MediaType;

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
