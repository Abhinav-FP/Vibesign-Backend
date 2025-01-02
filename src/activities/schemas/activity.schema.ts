import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument, Types} from 'mongoose';
import {ObjectId} from 'mongodb';
import {createTransformer} from '@stemy/nest-utils';
import {User} from '../../schemas/user.schema';
import {Device} from '../../devices/schemas/device.schema';

export class Location {

    constructor(public lat: number = 0, public lng: number = 0) {
    }
}

@Schema({
    id: true,
    timestamps: { createdAt: true, updatedAt: true },
    toJSON: {
        transform: createTransformer()
    }
})
export class Activity {
    @Prop()
    name: string;

    @Prop({type: () => Location})
    location: Location;

    @Prop()
    address: string;

    @Prop({type: Types.ObjectId, required: false, ref: User.name})
    owner: ObjectId;

    @Prop({type: Types.ObjectId, required: false, ref: Device.name})
    device: ObjectId;
}

export type ActivityDoc = HydratedDocument<Activity>;

export const ActivitySchema = SchemaFactory.createForClass(Activity);
