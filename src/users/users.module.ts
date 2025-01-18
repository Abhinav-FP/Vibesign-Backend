import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';

import {UsersService} from './users.service';
import {CustomersController} from './customers.controller';
import {PartnersController} from './partners.controller';
import {User, UserSchema} from './user.schema';
import {Manager, ManagerSchema} from '../managers/manager.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: User.name, schema: UserSchema},
            {name: Manager.name, schema: ManagerSchema},
        ])
    ],
    providers: [UsersService],
    controllers: [CustomersController, PartnersController],
    exports: [UsersService]
})
export class UsersModule {
}
