import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument, Types} from 'mongoose';
import {ObjectId} from 'mongodb';
import {createTransformer, ToObjectId} from '@stemy/nest-utils';
import {User} from '../users/user.schema';
import {UserRole} from '../common-types';

@Schema({
    id: true,
    timestamps: { createdAt: true, updatedAt: true },
    toJSON: {
        transform: createTransformer()
    }
})
export class Manager {

    @Prop()
    firstName: string;

    @Prop()
    lastName: string;

    @Prop({unique: true})
    email: string;

    @Prop()
    phone: string;

    @Prop({type: Types.ObjectId, required: false})
    @ToObjectId()
    picture: Types.ObjectId;

    @Prop()
    active: boolean;

    @Prop({unique: true})
    username: string;

    @Prop()
    password: string;

    @Prop()
    role: UserRole;

    @Prop({type: Types.ObjectId, required: false, ref: User.name})
    host: ObjectId;

}

export type ManagerDoc = HydratedDocument<Manager>;

export const ManagerSchema = SchemaFactory.createForClass(Manager);
