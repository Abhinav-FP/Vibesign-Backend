import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument, Types} from 'mongoose';
import {ObjectId} from 'mongodb';
import {createTransformer} from '@stemy/nest-utils';
import {User} from "../../schemas/user.schema";
import {Playlist} from "../../playlists/schemas/playlist.schema";

@Schema({
    id: true,
    timestamps: { createdAt: true, updatedAt: true },
    toJSON: {
        transform: createTransformer()
    }
})
export class Channel {
    @Prop()
    name: string;

    @Prop({type: Types.ObjectId, required: false, ref: User.name})
    owner: ObjectId;

    @Prop({type: Types.ObjectId, required: false, ref: Playlist.name})
    playlists: ObjectId[];
}

export type ChannelDoc = HydratedDocument<Channel>;

export const ChannelSchema = SchemaFactory.createForClass(Channel);

ChannelSchema.index({name: 1, owner: 1}, { unique: true });
