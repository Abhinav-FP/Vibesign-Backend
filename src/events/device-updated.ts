import {DeviceDoc} from '../devices/device.schema';

export class DeviceUpdated {

    readonly oldCode: string;

    constructor(readonly device: DeviceDoc, oldCode: string = null) {
        this.oldCode = oldCode || device.hexCode;
    }
}
