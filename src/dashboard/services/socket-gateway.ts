import {isDate} from 'class-validator';
import {Model} from 'mongoose';
import {Server, Socket} from 'socket.io';
import {Injectable, Logger} from '@nestjs/common';
import {OnEvent} from '@nestjs/event-emitter';
import {InjectModel} from '@nestjs/mongoose';
import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from '@nestjs/websockets';
import {AssetsService, IAsset, promiseTimeout, setAndUpdate} from '@stemy/nest-utils';

import {DeviceUpdated} from '../../events/device-updated';
import {UserUpdated} from '../../events/user-updated';
import {Channel, ChannelDoc} from '../../channels/channel.schema';
import {Device, DeviceDoc} from '../../devices/device.schema';
import {PlaylistDoc} from '../../playlists/playlist.schema';
import {UserDoc} from '../../users/user.schema';
import {DeviceLocation} from './dto';

export interface ClientSocket extends Socket {
    deviceCode: string;
}

export interface DeviceInfo {
    settings?: any;
    screenInfo?: any;
    playlist?: any;
    error?: string;
    color?: string;
    textColor?: string;
}

@Injectable()
@WebSocketGateway()
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {

    protected readonly logger: Logger;
    protected readonly clients: ClientSocket[];
    protected readonly screenshotMap: Map<string, (device: DeviceDoc) => void>;

    @WebSocketServer() io: Server;

    constructor(protected assets: AssetsService,
                @InjectModel(Channel.name) protected channelModel: Model<Channel>,
                @InjectModel(Device.name) protected deviceModel: Model<Device>) {
        this.logger = new Logger(this.constructor.name);
        this.clients = [];
        this.screenshotMap = new Map();
    }

    getClient(device: DeviceDoc) {
        return this.clients.find(client => client.deviceCode === device.hexCode) || null;
    }

    async screenShot(device: DeviceDoc): Promise<IAsset> {
        const client = this.getClient(device);
        if (client) {
            const shotPromise = new Promise<DeviceDoc>(resolve => {
                this.screenshotMap.set(device.id, resolve);
            });
            client.emit('screenshot');
            // Wait for successful screenshot or timeout
            const result = await Promise.race([shotPromise, promiseTimeout(7500)]) as DeviceDoc;
            // Save new device instance
            device = result || device;
            // Remove resolver function from map
            this.screenshotMap.delete(device.id);
        }
        return !device.lastScreenShot ? null : this.assets.read(device.lastScreenShot);
    }

    async handleConnection(@ConnectedSocket() client: ClientSocket) {
        this.logger.verbose(`Client id: ${client.id} connected`);
        this.clients.push(client);
    }

    async handleDisconnect(@ConnectedSocket() client: ClientSocket) {
        this.logger.verbose(`Client id: ${client.id} disconnected`);
        const index = this.clients.indexOf(client);
        if (index < 0) return;
        this.clients.splice(index, 1);
        await this.deviceModel.updateOne({hexCode: client.deviceCode}, {lastActive: new Date()});
    }

    @OnEvent(UserUpdated.name)
    async onUserUpdated(ev: UserUpdated) {
        const devices = await this.deviceModel.find({owner: ev.user._id});
        for (const device of devices) {
            const client = this.clients.find(c => c.deviceCode === device.hexCode);
            if (client) {
                client.emit('deviceInfo', await this.getDeviceInfo(device));
            }
        }
    }

    @OnEvent(DeviceUpdated.name)
    async onDeviceUpdated(ev: DeviceUpdated) {
        const oldClient = this.clients.find(c => c.deviceCode === ev.oldCode);
        const client = this.clients.find(c => c.deviceCode === ev.device.hexCode);
        if (oldClient && oldClient !== client) {
            oldClient.emit('deviceInfo', {});
        }
        if (client) {
            client.emit('deviceInfo', await this.getDeviceInfo(ev.device));
        }
    }

    @SubscribeMessage('deviceCode')
    async onDeviceId(@ConnectedSocket() client: ClientSocket, @MessageBody() deviceId: string) {
        client.deviceCode = deviceId;
        const device = await this.deviceModel.findOne({hexCode: deviceId});
        client.emit('deviceInfo', await this.getDeviceInfo(device));
    }

    @SubscribeMessage('deviceLocation')
    async onDeviceLocation(@ConnectedSocket() client: ClientSocket, @MessageBody() data: DeviceLocation) {
        const device = await this.deviceModel.findOne({hexCode: client.deviceCode});
        if (!device) return;
        const {address, lat, lng} = device.address || {address: '', lat: 0, lng: 0};
        data.address = data.address || address;
        data.location = data.location || {lat, lng};
        data.location.lat = data.location.lat ?? lat;
        data.location.lng = data.location.lng ?? lng;

        await setAndUpdate(device, {
            lastActive: new Date(),
            address: {
                address: data.address,
                lat: data.location.lat,
                lng: data.location.lng,
            }
        } as any);
    }

    @SubscribeMessage('screenshot')
    async onDeviceScreenShot(@ConnectedSocket() client: ClientSocket, @MessageBody() shot: string) {
        const device = await this.deviceModel.findOne({hexCode: client.deviceCode});
        if (!device) return;

        if (device.lastScreenShot) {
            const old = await this.assets.read(device.lastScreenShot);
            await old.unlink();
        }

        const newAsset = await this.assets.writeUrl(shot, {filename: `screenshot-${device.id}`});

        await setAndUpdate(device, {
            lastActive: new Date(),
            lastScreenShot: newAsset.oid
        });

        if (this.screenshotMap.has(device.id)) {
            this.screenshotMap.get(device.id)?.(device);
        }
    }

    protected async getPlaylist(device: DeviceDoc): Promise<any[]> {
        try {
            await device.populate('channel');
            const channel: ChannelDoc = device.channel as any;
            await channel.populate('playlists');
            const playlists = channel.playlists
                .map(p => p as unknown as PlaylistDoc);
            await Promise.all(playlists.map(p => p.populate('media')));
            return playlists.map(p => p.media).flat();
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    protected async getDeviceInfo(device: DeviceDoc): Promise<DeviceInfo> {
        if (!device) return {};
        if (device.active === false) {
            return {
                error: 'app.message.device-inactive.error'
            };
        }
        await device.populate('owner');
        const owner: UserDoc = device.owner as any;
        if (owner.active === false) {
            return {
                error: 'app.message.user-inactive.error'
            };
        }
        if (isDate(owner.expiryDate) && owner.expiryDate <= new Date()) {
            return {
                error: 'app.message.user-expired.error'
            };
        }
        const {settings, screenInfo} = device.toJSON();
        const playlist = await this.getPlaylist(device);
        if (playlist.length === 0) {
            return {
                error: 'app.message.playlist-empty.warning'
            };
        }
        return {
            settings,
            screenInfo,
            playlist: await this.getPlaylist(device)
        }
    }
}
