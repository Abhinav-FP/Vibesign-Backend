import { registerAs } from '@nestjs/config';
import {IDashboardModuleOpts} from '../dashboard/common';

export default registerAs('dashboard', () => ({
    expoUser: process.env.EXPO_USER || '',
    expoPassword: process.env.EXPO_PASSWORD || '',
} as IDashboardModuleOpts));
