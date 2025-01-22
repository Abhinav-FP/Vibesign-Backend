import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument, Types} from 'mongoose';
import {ObjectId} from 'mongodb';
import {createTransformer, ToObjectId} from '@stemy/nest-utils';

import {UserRole} from '../common-types';

@Schema({
    id: true,
    timestamps: { createdAt: true, updatedAt: true },
    toJSON: {
        transform: createTransformer((doc, ret) => {
            delete ret.password;
        })
    }
})
export class User {

    @Prop()
    name: string;

    @Prop({unique: true})
    email: string;

    @Prop({required: false})
    phone: string;

    @Prop({required: false})
    deviceLimit: number;

    @Prop()
    expiryDate: Date;

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

export type ResponseUser = Omit<User, 'password'>;

export type UserDoc = HydratedDocument<User>;

export const UserSchema = SchemaFactory.createForClass(User);
