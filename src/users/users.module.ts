import {Module} from '@nestjs/common';
import {UsersService} from './users.service';
import {CustomersController} from "./customers.controller";
import {PartnersController} from "./partners.controller";
import {MongooseModule} from '@nestjs/mongoose';
import {User, UserSchema} from '../schemas/user.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{name: User.name, schema: UserSchema}])
    ],
    providers: [UsersService],
    controllers: [CustomersController, PartnersController],
    exports: [UsersService]
})
export class UsersModule {
}
