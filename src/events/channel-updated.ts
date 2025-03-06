import {ChannelDoc} from '../channels/channel.schema';

export class ChannelUpdated {
    constructor(readonly channel: ChannelDoc) {

    }
}
