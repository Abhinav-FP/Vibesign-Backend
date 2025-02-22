import {FactoryToken} from '@stemy/nest-utils';

export interface BuildData {
    builds: {
        byId: {
            id: string;
            createdAt: string;
            platform: 'ANDROID' | 'IOS';
            status: 'FINISHED' | 'FAILED' | 'IN_PROGRESS';
            buildProfile: 'preview' | 'development' | 'production';
            appBuildVersion: string;
            appVersion: string;
            gitCommitMessage: string;
            artifacts: {
                applicationArchiveUrl: string;
                buildArtifactsUrl: string;
                xcodeBuildLogsUrl: string;
            }
        }
    }
}

export interface BuildEdge {
    node: {
        id: string;
        createdAt: string;
        buildPlatform: 'ANDROID' | 'IOS';
        buildStatus: 'FINISHED' | 'FAILED' | 'IN_PROGRESS';
        buildGitCommitMessage: string;
        expirationDate: string;
        buildProfile: 'preview' | 'development' | 'production';
        appBuildVersion: string;
        appVersion: string;
    }
}

export interface BuildsResponse {
    app: {
        byFullName: {
            buildsPaginated: {
                edges: BuildEdge[];
            }
        }
    }
}

export const APK_MIME = 'application/vnd.android.package-archive';

export interface IMiscModuleOpts {
    expoUser?: string;
    expoPassword?: string;
    uiUrl?: string;
}

export const EXPO_USER: FactoryToken<string> = Symbol.for('EXPO_USER');
export const EXPO_PASSWORD: FactoryToken<string> = Symbol.for('EXPO_PASSWORD');
export const UI_URL: FactoryToken<string> = Symbol.for('UI_URL');
export const MISC_MODULE_OPTIONS: FactoryToken<IMiscModuleOpts> = Symbol.for('MISC_MODULE_OPTIONS');
