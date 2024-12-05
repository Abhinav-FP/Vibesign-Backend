import { ObjectId } from 'mongodb';

export class BaseModel {

    // Map the `id` to `_id` for convenience
    get id() {
        return this._id.toHexString();
    }

    // Ensure `_id` is included as an ObjectId
    _id: ObjectId;

}
