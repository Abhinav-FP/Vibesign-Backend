import {FilterQuery} from 'mongoose';
import {IsEmail, IsOptional, IsString, MinLength} from 'class-validator';
import {toRegexFilter} from '@stemy/nest-utils';

import {ApiProperty} from '../decorators';
import {TicketDoc} from './ticket.schema';

export class ListTicketDto {

    @IsOptional()
    @ApiProperty({format: 'datetime', disableFilter: true})
    createdAt: Date = null;

    @IsString()
    @IsOptional()
    @ApiProperty()
    name: string = '';

    @IsString()
    @IsOptional()
    @ApiProperty()
    email: string = '';

    @IsString()
    @IsOptional()
    @ApiProperty()
    subject: string = '';

    @IsString()
    @IsOptional()
    filter: string = '';

    toQuery(): FilterQuery<TicketDoc> {
        return toRegexFilter({
            name: this.name,
            email: this.email,
            subject: this.subject,
        }, this.filter);
    }
}

export class TicketDto {
    @MinLength(3)
    @ApiProperty()
    name: string = '';

    @IsEmail()
    @ApiProperty({format: 'email'})
    email: string = '';

    @MinLength(3)
    @ApiProperty()
    subject: string = '';

    @MinLength(10)
    @ApiProperty({format: 'textarea'})
    notes: string = '';

}

export class AddTicketDto extends TicketDto {

}

export class EditTicketDto extends TicketDto {

}
