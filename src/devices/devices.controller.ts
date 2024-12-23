import {BadRequestException, Body, Controller, Delete, Get, Patch, Post, Query} from '@nestjs/common';
import {AuthUser, QueryPipe, ResolveEntity} from '@stemy/nest-utils';

import {UserDoc} from '../schemas/user.schema';
import {Device, DeviceDoc} from './schemas/device.schema';
import {AddDeviceDto, EditDeviceDto, ListDeviceDto} from './dtos/device.dto';
import {DevicesService} from "./devices.service";

@Controller('devices')
export class DevicesController {

    constructor(protected devices: DevicesService) {
    }

    @Get()
    async list(@AuthUser() authUser: UserDoc,
               @Query('page') page: number = 0,
               @Query('limit') limit: number = 20,
               @Query('sort') sort: string = '',
               @Query('query', QueryPipe) q: ListDeviceDto) {
        return await this.devices.paginate(
            q.toQuery(authUser),
            {page, limit, sort}
        );
    }

    @Get('/channels')
    async getPlaylists(@AuthUser() authUser: UserDoc) {
        return this.devices.listChannels(authUser);
    }

    @Get('/new/default')
    async getDefault() {
        return new AddDeviceDto();
    }

    @Post()
    async add(@AuthUser() authUser: UserDoc, @Body() dto: AddDeviceDto) {
        const playlist = this.devices.create(dto);
        try {
            playlist.owner = authUser._id;
            await playlist.save();
        } catch (e) {
            throw new BadRequestException(`${e}`);
        }
        return playlist.toJSON();
    }

    @Get('/:id')
    async get(@ResolveEntity(Device) device: DeviceDoc) {
        return device.toJSON();
    }

    @Patch('/:id')
    async update(@ResolveEntity(Device) device: DeviceDoc, @Body() dto: EditDeviceDto) {
        try {
            await this.devices.update(device, dto);
        } catch (e) {
            throw new BadRequestException(`${e}`);
        }
        return device.toJSON();
    }

    @Delete('/:id')
    async delete(@ResolveEntity(Device) device: DeviceDoc) {
        return this.devices.delete(device);
    }
}
