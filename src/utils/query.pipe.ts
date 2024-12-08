import { ArgumentMetadata, Logger, ValidationPipe } from '@nestjs/common';

export class QueryPipe extends ValidationPipe {
    private readonly logger = new Logger(QueryPipe.name);

    constructor() {
        super({ transform: true });
    }

    transform(value: any, metadata: ArgumentMetadata): any {
        try {
            return super.transform(JSON.parse(value), metadata);
        } catch (err) {
            this.logger.log(err);
        }
    }
}
