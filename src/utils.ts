import { Document, Types } from 'mongoose';
import { ObjectId } from 'mongodb';

export function isString(value: any): value is string {
    return typeof value === "string";
}

export function isFunction(value: any): value is Function {
    return typeof value === "function";
}

export function idToString(value: any): any {
    if (Array.isArray(value)) {
        return value.map(idToString);
    }
    return value instanceof ObjectId || value instanceof Types.ObjectId
        ? value.toHexString()
        : (isString(value) ? value : value || null);
}

export function createTransformer(transform?: (doc: Document, ret: any, options?: any) => any) {
    return (doc: Document, ret: any, options?: any) => {
        ret.id = idToString(ret.id) || ret.id;
        if (doc._id) {
            ret._id = idToString(doc._id);
            ret.id = ret.id || ret._id;
        }
        delete ret.__v;
        return isFunction(transform) ? transform(doc, ret, options) || ret : ret;
    };
}
