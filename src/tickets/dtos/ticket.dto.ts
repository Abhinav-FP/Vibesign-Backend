import {FilterQuery, Types} from 'mongoose';
import {IsOptional, IsString, MinLength} from 'class-validator';
import {ToObjectId} from '@stemy/nest-utils';

import {ApiProperty} from '../../decorators';
import {UserDoc} from '../../schemas/user.schema';
import {TicketDoc} from '../schemas/ticket.schema';

export class ListTicketDto {

    @IsString()
    @IsOptional()
    @ApiProperty()
    name: string = '';

    toQuery(user: UserDoc): FilterQuery<TicketDoc> {
        return {
            name: {$regex: this.name, $options: 'i'}
        } as FilterQuery<TicketDoc>;
    }
}

export class TicketDto {
    @MinLength(3)
    @ApiProperty()
    name: string = '';

}

export class AddTicketDto extends TicketDto {

}

export class EditTicketDto extends TicketDto {

}
