import {Controller, Get, Query} from '@nestjs/common';
import {ApiExtraModels} from '@nestjs/swagger';
import {AuthUser, QueryPipe, ResolveEntity} from '@stemy/nest-utils';

import {UserDoc} from '../users/user.schema';
import {Activity, ActivityDoc} from './activity.schema';
import {AddActivityDto, EditActivityDto, ListActivityDto} from './activity.dto';
import {ActivitiesService} from './activities.service';

@Controller('activities')
export class ActivitiesController {

    constructor(protected tickets: ActivitiesService) {
    }

    @Get()
    async list(@AuthUser() authUser: UserDoc,
               @Query('page') page: number = 0,
               @Query('limit') limit: number = 20,
               @Query('sort') sort: string = '',
               @Query('query', QueryPipe) q: ListActivityDto) {
        return await this.tickets.paginate(
            q.toQuery(authUser),
            {page, limit, sort}
        );
    }

    @Get('/new/default')
    async getDefault() {
        return new AddActivityDto();
    }

    @Get('/:id')
    @ApiExtraModels(EditActivityDto)
    async get(@ResolveEntity(Activity) activity: ActivityDoc) {
        return activity.toJSON();
    }
}
