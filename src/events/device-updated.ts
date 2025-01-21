import {DeviceDoc} from '../devices/device.schema';

export class DeviceUpdated {
    constructor(readonly device: DeviceDoc, readonly oldCode: string) {

    }
}
