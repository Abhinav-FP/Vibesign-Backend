import {BadRequestException, Body, Controller, Delete, Get, Patch, Post, Query} from '@nestjs/common';
import {AuthUser, QueryPipe, ResolveEntity} from '@stemy/nest-utils';

import {UserDoc} from '../schemas/user.schema';
import {Ticket, TicketDoc} from './schemas/ticket.schema';
import {AddTicketDto, EditTicketDto, ListTicketDto} from './dtos/ticket.dto';
import {TicketsService} from "./tickets.service";

@Controller('tickets')
export class TicketsController {

    constructor(protected tickets: TicketsService) {
    }

    @Get()
    async list(@AuthUser() authUser: UserDoc,
               @Query('page') page: number = 0,
               @Query('limit') limit: number = 20,
               @Query('sort') sort: string = '',
               @Query('query', QueryPipe) q: ListTicketDto) {
        return await this.tickets.paginate(
            q.toQuery(authUser),
            {page, limit, sort}
        );
    }

    @Get('/new/default')
    async getDefault() {
        return new AddTicketDto();
    }

    @Post()
    async add(@AuthUser() authUser: UserDoc, @Body() dto: AddTicketDto) {
        const playlist = this.tickets.create(dto);
        try {
            playlist.owner = authUser._id;
            await playlist.save();
        } catch (e) {
            throw new BadRequestException(`${e}`);
        }
        return playlist.toJSON();
    }

    @Get('/:id')
    async get(@ResolveEntity(Ticket) ticket: TicketDoc) {
        return ticket.toJSON();
    }

    @Patch('/:id')
    async update(@ResolveEntity(Ticket) ticket: TicketDoc, @Body() dto: EditTicketDto) {
        return ticket.toJSON();
    }

    @Delete('/:id')
    async delete(@ResolveEntity(Ticket) ticket: TicketDoc) {
        return this.tickets.delete(ticket);
    }
}
