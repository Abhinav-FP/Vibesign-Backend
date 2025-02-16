import { registerAs } from '@nestjs/config';
import { MailerModuleOpts } from '@stemy/nest-utils';

export default registerAs('mailer', () => ({
    smtp: {
        host: process.env.SMTP_HOST || 'localhost',
        credentials: {
            user: process.env.SMTP_USER || '',
            pass: process.env.SMTP_PASSWORD || ''
        },
        secure: process.env.SMTP_SECURE === 'true'
    },
    defaultOptions: {
        from: 'info@vibesign.com',
        sender: `VibeSign <info@vibesign.com>`
    },
    preview: process.env.PREVIEW_EMAILS === 'true',
} as MailerModuleOpts));
