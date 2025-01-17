import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {FilterQuery, Model} from 'mongoose';
import {IPagination, IPaginationParams, paginate} from '@stemy/nest-utils';
import {Activity, ActivityDoc} from './activity.schema';

@Injectable()
export class ActivitiesService {

    constructor(@InjectModel(Activity.name) protected model: Model<Activity>) {
    }

    paginate(query: FilterQuery<ActivityDoc>, params: IPaginationParams<Activity>): Promise<IPagination<ActivityDoc>> {
        return paginate(this.model, query, params);
    }
}
