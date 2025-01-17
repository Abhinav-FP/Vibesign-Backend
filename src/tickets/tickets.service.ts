import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {FilterQuery, Model} from 'mongoose';
import {IPagination, IPaginationParams, paginate} from '@stemy/nest-utils';

import {AddTicketDto} from './ticket.dto';
import {Ticket, TicketDoc} from './ticket.schema';

@Injectable()
export class TicketsService {

    constructor(@InjectModel(Ticket.name) protected model: Model<Ticket>) {
    }

    paginate(query: FilterQuery<TicketDoc>, params: IPaginationParams<Ticket>): Promise<IPagination<TicketDoc>> {
        return paginate(this.model, query, params);
    }

    create(dto: AddTicketDto): TicketDoc {
        return new this.model(dto);
    }

    async delete(ticket: TicketDoc): Promise<any> {
        if (!ticket) return null;
        return ticket.deleteOne();
    }
}
