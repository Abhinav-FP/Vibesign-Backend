import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {AssetsModule} from '@stemy/nest-utils';
import {Ticket, TicketSchema} from './ticket.schema';

import {TicketsService} from './tickets.service';
import {TicketsController} from './tickets.controller';

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: Ticket.name, schema: TicketSchema},
        ]),
        AssetsModule
    ],
    controllers: [TicketsController],
    providers: [TicketsService],
    exports: [TicketsService]
})
export class TicketsModule {
}
