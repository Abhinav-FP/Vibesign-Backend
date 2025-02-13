import { registerAs } from '@nestjs/config';
import {IMiscModuleOpts} from '../dashboard/common';

export default registerAs('misc', () => ({
    expoUser: process.env.EXPO_USER || '',
    expoPassword: process.env.EXPO_PASSWORD || '',
} as IMiscModuleOpts));
