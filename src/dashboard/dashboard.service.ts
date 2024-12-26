import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {UserDoc} from '../schemas/user.schema';

@Injectable()
export class DashboardService {

    constructor() {
    }

    async aggregate(user: UserDoc): Promise<any> {
        return {
            devices: {
                total: 5,
                online: 2,
                offline: 3
            },
            recent: [
                {
                    name: 'Testingscreen',
                    address: '37 W 53rd St, New York, NY 10019, USA 18th Floor, New York, NY 10019',
                    location: [40.75002355872513, -74.15814154780075]
                },
                {
                    name: 'Testing FP',
                    address: 'Jaipur, Rajasthan, India',
                    location: [26.90157607519801, 75.77272084908525]
                },
                {
                    name: 'Divya',
                    address: 'FF-109, Nilamber Billissimo-3, 1, Vasna Bhayli Main Rd, nr. Nilamber Bellissimo, Gotri, Vadodara, Gu...',
                    location: [22.299468961666925, 73.13424174896343]
                }
            ]
        };
    }
}
