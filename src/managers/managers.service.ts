import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {FilterQuery, Model} from 'mongoose';
import {IPagination, IPaginationParams, paginate, setAndUpdate} from '@stemy/nest-utils';

import {AddManagerDto, EditManagerDto} from './manager.dto';
import {Manager, ManagerDoc} from './manager.schema';

@Injectable()
export class ManagersService {

    constructor(@InjectModel(Manager.name) protected model: Model<Manager>) {
    }

    paginate(query: FilterQuery<ManagerDoc>, params: IPaginationParams<Manager>): Promise<IPagination<ManagerDoc>> {
        return paginate(this.model, query, params);
    }

    create(dto: AddManagerDto): ManagerDoc {
        return new this.model(dto);
    }

    update(manager: ManagerDoc, dto: EditManagerDto) {
        return setAndUpdate(manager, dto);
    }

    async delete(manager: ManagerDoc): Promise<any> {
        if (!manager) return null;
        return manager.deleteOne();
    }
}
