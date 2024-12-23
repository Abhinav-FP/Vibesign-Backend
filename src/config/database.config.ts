import { registerAs } from '@nestjs/config';
import { MongooseModuleFactoryOptions } from '@nestjs/mongoose';

export default registerAs('database', () => ({
    uri: process.env.DATABASE_URI || 'dsfdsf',
    dbName: process.env.DATABASE_NAME || 'vibesign',
    user: process.env.DATABASE_USER || '',
    pass: process.env.DATABASE_PASSWORD || '',
} as MongooseModuleFactoryOptions));
