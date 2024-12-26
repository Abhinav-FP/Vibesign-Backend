import {Controller, Get, StreamableFile} from '@nestjs/common';
import {AuthUser, Public} from '@stemy/nest-utils';

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

    @Public()
    @Get('download-app')
    async downloadApp() {
        const stream = await this.dashboard.downloadApp();
        return new StreamableFile(stream, {
            type: 'application/vnd.android.package-archive',
            disposition: 'attachment; filename="vibe-sign.apk"'
        });
    }
}
