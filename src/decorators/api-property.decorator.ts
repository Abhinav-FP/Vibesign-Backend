import { ApiProperty as Base, ApiPropertyOptions as BaseOptions } from '@nestjs/swagger';

export type ApiPropertyOptions = BaseOptions & {
    disableFilter?: boolean;
    filterType?: "string" | "checkbox";
}

export function ApiProperty(opts?: ApiPropertyOptions): PropertyDecorator {
    return Base(opts);
}
