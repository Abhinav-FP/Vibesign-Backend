import { ApiProperty as Base, ApiPropertyOptions } from '@nestjs/swagger';

export type ApiPropertyOpts = Omit<ApiPropertyOptions, 'type'> & {
    type?: 'file' | ApiPropertyOptions['type'];
    hidden?: boolean;
    serialize?: boolean;
    disableFilter?: boolean;
    disableSort?: boolean;
    filterType?: 'string' | 'checkbox';
    url?: string;
    multi?: boolean;
    accept?: string[];
    endpoint?: string;
    labelField?: string;
    step?: number;
    fieldSet?: string;
    column?: boolean;
}

export function ApiProperty(opts?: ApiPropertyOpts): PropertyDecorator {
    return Base(opts as any);
}
