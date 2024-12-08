import {Module} from '@nestjs/common';
import {UsersService} from './users.service';
import {CustomersController} from "./customers.controller";
import {PartnersController} from "./partners.controller";
import {UsersController} from './users.controller';
import {MongooseModule} from '@nestjs/mongoose';
import {User, UserSchema} from '../schemas/user.schema';

const mongoose = MongooseModule.forFeature([{name: User.name, schema: UserSchema}]);

@Module({
    imports: [mongoose],
    providers: [UsersService],
    controllers: [CustomersController, PartnersController, UsersController],
    exports: [UsersService, mongoose]
})
export class UsersModule {
}
