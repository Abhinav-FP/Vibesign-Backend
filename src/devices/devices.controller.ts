import {BadRequestException, Body, Controller, Delete, Get, Patch, Post, Query} from '@nestjs/common';
import {ApiExtraModels} from '@nestjs/swagger';
import {AuthUser, ComplexQuery, Public, ResolveEntity} from '@stemy/nest-utils';

import {UserDoc} from '../users/user.schema';
import {Device, DeviceDoc} from './device.schema';
import {AddDeviceDto, EditDeviceDto, ListDeviceDto} from './device.dto';
import {DevicesService} from './devices.service';
import {ChannelDoc} from '../channels/channel.schema';
import {PlaylistDoc} from '../playlists/playlist.schema';
import {AddActivityDto} from '../activities/activity.dto';

@Controller('devices')
export class DevicesController {

    constructor(protected devices: DevicesService) {
    }

    @Get()
    @ApiExtraModels(ListDeviceDto)
    async list(@AuthUser() authUser: UserDoc,
               @Query('page') page: number = 0,
               @Query('limit') limit: number = 20,
               @Query('sort') sort: string = '',
               @ComplexQuery() q: ListDeviceDto) {
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
