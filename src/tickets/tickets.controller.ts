import {BadRequestException, Body, Controller, Delete, Get, Post, Query} from '@nestjs/common';
import {ApiExtraModels} from '@nestjs/swagger';
import {AuthUser, ComplexQuery, ResolveEntity} from '@stemy/nest-utils';

import {UserDoc} from '../users/user.schema';
import {Ticket, TicketDoc} from './ticket.schema';
import {AddTicketDto, EditTicketDto, ListTicketDto} from './ticket.dto';
import {TicketsService} from './tickets.service';

@Controller('tickets')
export class TicketsController {

    constructor(protected tickets: TicketsService) {
    }

    @Get()
    @ApiExtraModels(ListTicketDto)
    async list(@Query('page') page: number = 0,
               @Query('limit') limit: number = 20,
               @Query('sort') sort: string = '',
               @ComplexQuery() q: ListTicketDto) {
        return await this.tickets.paginate(
            q.toQuery(),
            {page, limit, sort}
        );
    }

    @Get('new/default')
    async getDefault() {
        return new AddTicketDto();
    }

    @Post()
    async add(@AuthUser() authUser: UserDoc, @Body() dto: AddTicketDto) {
        const ticket = this.tickets.create(dto);
        try {
            ticket.owner = authUser._id;
            await ticket.save();
        } catch (e) {
            throw new BadRequestException(`${e}`);
        }
        return ticket.toJSON();
    }

    @Get(':id')
    @ApiExtraModels(EditTicketDto)
    async get(@ResolveEntity(Ticket) ticket: TicketDoc) {
        return ticket.toJSON();
    }

    @Delete(':id')
    async delete(@ResolveEntity(Ticket) ticket: TicketDoc) {
        return this.tickets.delete(ticket);
    }
}
