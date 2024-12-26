import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument, Types} from 'mongoose';
import {ObjectId} from 'mongodb';
import {createTransformer} from '@stemy/nest-utils';
import {User} from "../../schemas/user.schema";

@Schema({
    id: true,
    timestamps: { createdAt: true, updatedAt: true },
    toJSON: {
        transform: createTransformer()
    }
})
export class Ticket {
    @Prop()
    name: string;

    @Prop({type: Types.ObjectId, required: false, ref: User.name})
    owner: ObjectId;


}

export type TicketDoc = HydratedDocument<Ticket>;

export const TicketSchema = SchemaFactory.createForClass(Ticket);

TicketSchema.index({name: 1, owner: 1}, { unique: true });
