import {Controller, Get} from '@nestjs/common';
import {AuthUser} from '@stemy/nest-utils';

import {UserDoc} from '../schemas/user.schema';
import {DashboardService} from './dashboard.service';

@Controller('dashboard')
export class DashboardController {

    constructor(protected dashboard: DashboardService) {
    }

    @Get()
    async aggregate(@AuthUser() authUser: UserDoc) {
        return await this.dashboard.aggregate(authUser);
    }

    @Get('download-app')
    async downloadApp() {
        return await this.dashboard.downloadApp();
    }
}
