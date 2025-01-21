import {UserDoc} from '../users/user.schema';

export class UserUpdated {
    constructor(readonly user: UserDoc) {
    }
}
