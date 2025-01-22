import {Injectable, Logger} from '@nestjs/common';
import {OnEvent} from '@nestjs/event-emitter';
import {InjectModel} from '@nestjs/mongoose';
import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from '@nestjs/websockets';
import {Model} from 'mongoose';
import {Server, Socket} from 'socket.io';

import {DeviceUpdated} from '../events/device-updated';
import {UserUpdated} from '../events/user-updated';
import {AddActivityDto} from '../activities/activity.dto';
import {Channel, ChannelDoc} from '../channels/channel.schema';
import {Activity} from '../activities/activity.schema';
import {Device, DeviceDoc} from '../devices/device.schema';
import {PlaylistDoc} from '../playlists/playlist.schema';
import {UserDoc} from '../users/user.schema';

export interface ClientSocket extends Socket {
    deviceId: string;
}

export interface DeviceInfo {
    error?: string;
    settings?: any;
    screenInfo?: any;
}

@Injectable()
@WebSocketGateway()
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    protected readonly logger: Logger;
    protected readonly clients: ClientSocket[];

    @WebSocketServer() io: Server;

    constructor(@InjectModel(Channel.name) protected channelModel: Model<Channel>,
                @InjectModel(Activity.name) protected activityModel: Model<Activity>,
                @InjectModel(Device.name) protected deviceModel: Model<Device>) {
        this.logger = new Logger(this.constructor.name);
        this.clients = [];
        this.logger.log('Initialized');
    }

    afterInit(): void {
        this.logger.log('Initialized');
    }

    handleConnection(@ConnectedSocket() client: ClientSocket) {
        this.logger.verbose(`Client id: ${client.id} connected`);
        this.clients.push(client);
    }

    handleDisconnect(@ConnectedSocket() client: ClientSocket) {
        this.logger.verbose(`Client id: ${client.id} disconnected`);
        const index = this.clients.indexOf(client);
        if (index < 0) return;
        this.clients.splice(index, 1);
    }

    @OnEvent(UserUpdated.name)
    async onUserUpdated(ev: UserUpdated) {
        const devices = await this.deviceModel.find({owner: ev.user._id});
        for (const device of devices) {
            const client = this.clients.find(c => c.deviceId === device.hexCode);
            if (client) {
                client.emit('deviceInfo', await this.getDeviceInfo(device));
                client.emit('playlist', await this.getPlaylist(device));
            }
        }
    }

    @OnEvent(DeviceUpdated.name)
    async onDeviceUpdated(ev: DeviceUpdated) {
        const oldClient = this.clients.find(c => c.deviceId === ev.oldCode);
        const client = this.clients.find(c => c.deviceId === ev.device.hexCode);
        if (oldClient && oldClient !== client) {
            oldClient.emit('deviceInfo', {});
            oldClient.emit('playlist', []);
        }
        if (client) {
            client.emit('deviceInfo', await this.getDeviceInfo(ev.device));
            client.emit('playlist', await this.getPlaylist(ev.device));
        }
    }

    @SubscribeMessage('deviceId')
    async onDeviceId(@ConnectedSocket() client: ClientSocket, @MessageBody() deviceId: string) {
        client.deviceId = deviceId;
        const device = await this.deviceModel.findOne({hexCode: deviceId});
        client.emit('deviceInfo', await this.getDeviceInfo(device));
        client.emit('playlist', await this.getPlaylist(device));
    }

    @SubscribeMessage('activity')
    onActivity(@ConnectedSocket() client: ClientSocket, @MessageBody() data: AddActivityDto) {
        console.log('device updated', data);
    }

    protected async getPlaylist(device: DeviceDoc): Promise<any[]> {
        if (!device) return [];
        try {
            if (!device.active) {
                return [];
            }
            await device.populate('owner');
            const owner: UserDoc = device.owner as any;
            if (owner.expiryDate <= new Date()) {
                return [];
            }
            await device.populate('channel');
            const channel: ChannelDoc = device.channel as any;
            await channel.populate('playlists');
            const playlists = channel.playlists
                .map(p => p as unknown as PlaylistDoc);
            await Promise.all(playlists.map(p => p.populate('medias')));
            return playlists.map(p => p.medias).flat();
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    protected async getDeviceInfo(device: DeviceDoc): Promise<DeviceInfo> {
        if (!device) return {};
        if (!device.active) {
            return {
                error: 'message.device-inactive.error'
            };
        }
        await device.populate('owner');
        const owner: UserDoc = device.owner as any;
        if (!owner.active) {
            return {
                error: 'message.user-inactive.error'
            };
        }
        if (owner.expiryDate <= new Date()) {
            return {
                error: 'message.user-expired.error'
            };
        }
        return device.toJSON();
    }
}
