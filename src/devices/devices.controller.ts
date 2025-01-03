import {BadRequestException, Body, Controller, Delete, Get, Patch, Post, Query} from '@nestjs/common';
import {AuthUser, Public, QueryPipe, ResolveEntity} from '@stemy/nest-utils';

import {UserDoc} from '../schemas/user.schema';
import {Device, DeviceDoc} from './schemas/device.schema';
import {AddDeviceDto, EditDeviceDto, ListDeviceDto} from './dtos/device.dto';
import {DevicesService} from "./devices.service";
import {ChannelDoc} from "../channels/schemas/channel.schema";
import {PlaylistDoc} from "../playlists/schemas/playlist.schema";
import {ActivityDto, AddActivityDto} from "../activities/dtos/activity.dto";
import {Location, ActivityDoc} from "../activities/schemas/activity.schema";

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
    async getChannels(@AuthUser() authUser: UserDoc) {
        return this.devices.listChannels(authUser);
    }

    @Get('/new/default')
    async getDefault() {
        return new AddDeviceDto();
    }

    @Post()
    async add(@AuthUser() authUser: UserDoc, @Body() dto: AddDeviceDto) {
        let device: DeviceDoc = null;
        try {
            device = this.devices.create(dto);
            device.owner = authUser._id;
            await device.save();
        } catch (e) {
            throw new BadRequestException(`${e}`);
        }
        return device.toJSON();
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

    @Public()
    @Get('/:hexCode/playlist')
    async playlist(@ResolveEntity(Device, true, 'hexCode') device: DeviceDoc) {
        try {
            await device.populate('channel');
            const channel = device.channel as unknown as ChannelDoc;
            await channel.populate('playlists');
            const playlists = channel.playlists.map(p => p as unknown as PlaylistDoc);
            await Promise.all(playlists.map(p => p.populate('medias')));
            return playlists.map(p => p.medias).flat();
        } catch (e) {
            throw new BadRequestException(`${e}`);
        }
    }

    @Public()
    @Post('/:hexCode/playlist')
    async postPlaylist(@ResolveEntity(Device, true, 'hexCode') device: DeviceDoc,
                       @Body() dto: AddActivityDto) {
        try {
            await this.devices.createActivity(dto, device);
        } catch (e) {
            throw new BadRequestException(`${e}`);
        }
        return this.playlist(device);
    }
}
