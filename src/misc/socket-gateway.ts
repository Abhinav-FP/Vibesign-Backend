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
import {PlaylistDoc} from "../playlists/playlist.schema";

export interface ClientSocket extends Socket {
    deviceId: string;
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
    onUserUpdated(ev: UserUpdated) {
        console.log('user updated', ev);
    }

    @OnEvent(DeviceUpdated.name)
    async onDeviceUpdated(ev: DeviceUpdated) {
        const oldClient = this.clients.find(c => c.deviceId === ev.oldCode);
        const client = this.clients.find(c => c.deviceId === ev.device.hexCode);
        if (oldClient && oldClient !== client) {
            oldClient.emit('deviceInfo', null);
            oldClient.emit('playlist', null);
        }
        if (client) {
            client.emit('deviceInfo', ev.device.toJSON());
            client.emit('playlist', await this.generatePlaylist(ev.device));
        }
    }

    @SubscribeMessage('deviceId')
    async onDeviceId(@ConnectedSocket() client: ClientSocket, @MessageBody() deviceId: string) {
        client.deviceId = deviceId;
        const device = await this.deviceModel.findOne({hexCode: deviceId});
        client.emit('deviceInfo', device?.toJSON() || null);
        client.emit('playlist', await this.generatePlaylist(device));
    }

    @SubscribeMessage('activity')
    onActivity(@ConnectedSocket() client: ClientSocket, @MessageBody() data: AddActivityDto) {
        console.log('device updated', data);
    }

    protected async generatePlaylist(device: DeviceDoc): Promise<any[]> {
        if (!device) return null;
        try {
            await device.populate('channel');
            const channel = device.channel as unknown as ChannelDoc;
            await channel.populate('playlists');
            const playlists = channel.playlists.map(p => p as unknown as PlaylistDoc);
            await Promise.all(playlists.map(p => p.populate('medias')));
            const results = playlists.map(p => p.medias).flat();
            console.log(results, device.hexCode);
            return results;
        } catch (e) {
            console.log(e);
            return null;
        }
    }
}
