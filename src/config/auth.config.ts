import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
    jwtSecret: process.env.JWT_SECRET || 'pN59L&amp;rPrdwL)RagHWjvaQJiT',
    tokenDuration: parseInt(process.env.JWT_TOKEN_DURATION || '36000'),
}));
