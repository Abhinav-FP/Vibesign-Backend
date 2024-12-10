import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument, Types} from 'mongoose';
import {ObjectId} from 'mongodb';
import {createTransformer} from '@stemy/nest-utils';

import {User} from '../../schemas/user.schema';
import {MediaDir} from './media-dir.schema';

@Schema({
    id: true,
    timestamps: { createdAt: true, updatedAt: true },
    toJSON: {
        transform: createTransformer((_, ret) => {
            ret.type = 'file';
        })
    }
})
export class Media {

    @Prop()
    name: string;

    @Prop({type: Types.ObjectId, required: false, ref: MediaDir.name})
    parent: ObjectId;

    @Prop({type: Types.ObjectId, required: false, ref: User.name})
    owner: ObjectId;

    @Prop({type: Types.ObjectId, required: false})
    file: ObjectId;

    @Prop({type: Types.ObjectId, required: false})
    preview: ObjectId;
}

export type MediaDoc = HydratedDocument<Media>;

export const MediaSchema = SchemaFactory.createForClass(Media);

MediaSchema.index({name: 1, parent: 1, owner: 1}, { unique: true });
