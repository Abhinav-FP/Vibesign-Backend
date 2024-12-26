import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {AssetsModule} from '@stemy/nest-utils';

import {DashboardService} from './dashboard.service';
import {DashboardController} from './dashboard.controller';

@Module({
    imports: [
        MongooseModule.forFeature([
        ]),
        AssetsModule
    ],
    controllers: [DashboardController],
    providers: [DashboardService],
    exports: [DashboardService]
})
export class DashboardModule {
}
