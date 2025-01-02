import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {AssetsModule} from '@stemy/nest-utils';
import {Activity, ActivitySchema} from './schemas/activity.schema';

import {ActivitiesService} from './activities.service';
import {ActivitiesController} from './activities.controller';

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: Activity.name, schema: ActivitySchema},
        ]),
        AssetsModule
    ],
    controllers: [ActivitiesController],
    providers: [ActivitiesService],
    exports: [ActivitiesService]
})
export class ActivitiesModule {
}
