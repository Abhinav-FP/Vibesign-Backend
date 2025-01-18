import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {AssetsModule} from '@stemy/nest-utils';

import {Manager, ManagerSchema} from './manager.schema';

import {ManagersService} from './managers.service';
import {ManagersController} from './managers.controller';

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: Manager.name, schema: ManagerSchema},
        ]),
        AssetsModule
    ],
    controllers: [ManagersController],
    providers: [ManagersService],
    exports: [ManagersService]
})
export class ManagersModule {
}
