import {FactoryToken} from '@stemy/nest-utils';

export interface IDashboardModuleOpts {
    expoUser?: string;
    expoPassword?: string;
}

export const EXPO_USER: FactoryToken<string> = Symbol.for('EXPO_USER');
export const EXPO_PASSWORD: FactoryToken<string> = Symbol.for('EXPO_PASSWORD');
export const DASHBOARD_MODULE_OPTIONS: FactoryToken<IDashboardModuleOpts> = Symbol.for('DASHBOARD_MODULE_OPTIONS');
