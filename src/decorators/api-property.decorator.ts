import { ApiProperty as Base, ApiPropertyOptions as BaseOptions } from '@nestjs/swagger';

export type ApiPropertyOptions = BaseOptions & {
    hidden?: boolean;
    disableFilter?: boolean;
    filterType?: "string" | "checkbox";
}

export function ApiProperty(opts?: ApiPropertyOptions): PropertyDecorator {
    return Base(opts);
}
