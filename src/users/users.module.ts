import {DynamicModule, Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';

import {UsersService} from './users.service';
import {User, UserSchema} from './user.schema';
import {CustomersController} from './customers.controller';
import {PartnersController} from './partners.controller';
import {ManagersController} from './managers.controller';

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: User.name, schema: UserSchema}
        ])
    ],
    controllers: [CustomersController, PartnersController, ManagersController]
})
export class UsersModule {

    static forRoot(): DynamicModule {
        return {
            module: UsersModule,
            providers: [UsersService],
            global: true,
            exports: [UsersService]
        };
    }
}
