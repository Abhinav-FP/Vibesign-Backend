import {PlaylistDoc} from '../playlists/playlist.schema';

export class PlaylistUpdated {
    constructor(readonly playlist: PlaylistDoc) {

    }
}
