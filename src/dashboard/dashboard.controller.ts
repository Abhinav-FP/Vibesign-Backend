import {BadRequestException, Controller, Get, StreamableFile} from '@nestjs/common';
import {AuthUser, Public, ResolveEntity} from '@stemy/nest-utils';

import {UserDoc} from '../users/user.schema';
import {DashboardService} from './services/dashboard.service';
import {Device, DeviceDoc} from "../devices/device.schema";

@Controller('dashboard')
export class DashboardController {

    constructor(protected dashboard: DashboardService) {
    }

    @Get()
    async aggregate(@AuthUser() authUser: UserDoc) {
        return await this.dashboard.aggregate(authUser);
    }

    @Public()
    @Get('app-info')
    async appInfo() {
        try {
            const asset = await this.dashboard.appAsset();
            return asset.metadata;
        } catch (e) {
            throw new BadRequestException(`${e}`);
        }
    }

    @Public()
    @Get('download-app')
    async downloadApp() {
        try {
            const asset = await this.dashboard.appAsset();
            return new StreamableFile(asset.stream, {
                type: 'application/vnd.android.package-archive',
                disposition: `attachment; filename="${asset.filename}"`
            });
        } catch (e) {
            throw new BadRequestException(`${e}`);
        }
    }

    @Public()
    @Get('device-screenshot/:id')
    async screenShot(@ResolveEntity(Device) device: DeviceDoc) {
        const asset = await this.dashboard.screenShot(device);
        if (!asset) {
            return new BadRequestException(`Device does not have a preview to show`);
        }
        return new StreamableFile(asset.stream, {
            type: asset.contentType,
            disposition: `attachment; filename="${asset.filename}"`
        });
    }
}
