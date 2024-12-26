import {FilterQuery} from 'mongoose';
import {IsEmail, IsOptional, IsString, MinLength} from 'class-validator';

import {ApiProperty} from '../../decorators';
import {TicketDoc} from '../schemas/ticket.schema';

export class ListTicketDto {

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

    toQuery(): FilterQuery<TicketDoc> {
        return {
            name: {$regex: this.name, $options: 'i'},
            email: {$regex: this.email, $options: 'i'},
            subject: {$regex: this.subject, $options: 'i'},
        } as FilterQuery<TicketDoc>;
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
