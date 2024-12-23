import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';

import {UsersService} from './users.service';
import {AdminsController} from "./admins.controller";
import {CustomersController} from "./customers.controller";
import {PartnersController} from "./partners.controller";
import {User, UserSchema} from '../schemas/user.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{name: User.name, schema: UserSchema}])
    ],
    providers: [UsersService],
    controllers: [AdminsController, CustomersController, PartnersController],
    exports: [UsersService]
})
export class UsersModule {
}
