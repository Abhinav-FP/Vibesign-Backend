import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument, Types} from 'mongoose';
import {ObjectId} from 'mongodb';
import {createTransformer} from '@stemy/nest-utils';
import {User} from '../users/user.schema';
import {Media} from '../media/media.schema';

@Schema({
    id: true,
    timestamps: { createdAt: true, updatedAt: true },
    toJSON: {
        transform: createTransformer()
    }
})
export class Playlist {
    @Prop()
    name: string;

    @Prop({type: Types.ObjectId, required: false, ref: User.name})
    owner: ObjectId;

    @Prop({type: [Types.ObjectId], required: false, ref: Media.name})
    media: ObjectId[];
}

export type PlaylistDoc = HydratedDocument<Playlist>;

export const PlaylistSchema = SchemaFactory.createForClass(Playlist);

PlaylistSchema.index({name: 1, owner: 1}, { unique: true });
