import { ApiProperty as Base, ApiPropertyOptions as BaseOptions } from '@nestjs/swagger';

export type ApiPropertyOptions = Omit<BaseOptions, 'type'> & {
    type?: 'file' | BaseOptions['type'];
    hidden?: boolean;
    disableFilter?: boolean;
    filterType?: "string" | "checkbox";
    url?: string;
    multi?: boolean;
    accept?: string[];
    endpoint?: string;
    labelField?: string;
}

export function ApiProperty(opts?: ApiPropertyOptions): PropertyDecorator {
    return Base(opts as any);
}
