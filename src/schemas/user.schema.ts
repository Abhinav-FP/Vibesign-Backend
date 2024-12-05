import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseModel } from './base.model';
import { createTransformer } from '../utils';

export enum UserRole {
    Customer = "customer",
    Partner = "partner",
    Admin = "admin",
    SuperAdmin = "superAdmin",
}

@Schema({
    id: true,
    toJSON: {
        transform: createTransformer((doc, ret) => {
            delete ret.password;
        })
    }
})
export class User extends BaseModel {
    @Prop()
    email: string;

    @Prop()
    name: string;

    @Prop()
    username: string;

    @Prop()
    password: string;

    @Prop()
    role: UserRole;
}

export type ResponseUser = Omit<User, 'password'>;

export type UserDocument = HydratedDocument<User>;

export const UserSchema = SchemaFactory.createForClass(User);
