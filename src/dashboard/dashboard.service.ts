import {join} from 'path';
import {createReadStream} from 'fs';
import axios, {AxiosInstance} from 'axios';
import {Model} from 'mongoose';
import {Inject, Injectable} from '@nestjs/common'
import {InjectModel} from '@nestjs/mongoose';
import {Asset, AssetsService, compareId, IAsset, TempAsset} from '@stemy/nest-utils';

import {APK_MIME, BuildData, BuildsResponse, EXPO_PASSWORD, EXPO_USER} from './common';
import {UserDoc} from '../schemas/user.schema';
import {Device} from '../devices/schemas/device.schema';
import {Activity} from '../activities/schemas/activity.schema';


@Injectable()
export class DashboardService {

    protected expiresAt: Date;
    protected sessionSecret: string;
    protected client: AxiosInstance;

    constructor(readonly assets: AssetsService,
                @InjectModel(Device.name) protected deviceModel: Model<Device>,
                @InjectModel(Activity.name) protected activityModel: Model<Activity>,
                @Inject(EXPO_USER) protected expoUser: string,
                @Inject(EXPO_PASSWORD) protected expoPassword: string) {
        this.client = axios.create({
            baseURL: `https://api.expo.dev/graphql`,
            method: 'post'
        });
        this.client.interceptors.request.use(
            (config) => {
                config.headers['Expo-Session'] = this.sessionSecret;
                return config;
            },
            (error) => {
                // Handle request errors here
                return Promise.reject(error);
            }
        );
        this.client.interceptors.response.use(async (response) => {
            if (!Array.isArray(response.data)) {
                throw new Error(`${response.status}: ${response.statusText}`);
            }
            const errors = response.data.find(t => t.errors);
            if (errors) {
                throw new Error(`${errors}`);
            }
            response.data = response.data[0].data;
            return response;
        });
    }

    async aggregate(user: UserDoc): Promise<any> {
        const devices = await this.deviceModel.find({owner: user?._id});
        const $in = devices.map(d => d._id);
        const activities = await this.activityModel.find({device: {$in}});
        const online = devices.filter(d => {
            return activities.some(a => compareId(a.device, d._id) && a.isOnline());
        });
        return {
            devices: {
                total: devices.length,
                online: online.length,
                offline: devices.length - online.length
            },
            recent: activities.map(r => r.toJSON())
        };
    }

    async appAsset(): Promise<IAsset> {
        const path = join(__dirname, '..', '..', 'client', 'app.apk');
        const apps = await this.assets
            .findMany({contentType: APK_MIME, filename: {$regex: 'vibesign-', $options: 'i'}});
        const lastAsset = apps
            .sort((a, b) => Number(a.metadata.buildVersion) - Number(b.metadata.buildVersion))
            .pop() || new TempAsset(
            createReadStream(path, {autoClose: true}),
            'vibesign-2024-12-24.apk',
            APK_MIME,
            {
                filename: 'vibesign-2024-12-24.apk',
                buildDate: '2024-12-24T03:03:14.554Z',
                buildVersion: '1',
                version: '1.0.0',
                notes: 'Initial build'
            }
        );
        const build = await this.getLastBuild(lastAsset);
        if (build !== lastAsset) {
            await Promise.all(apps.map(a => a.unlink()));
        }
        return build;
    }

    protected async getSessionSecret(): Promise<string> {
        if (this.expiresAt && new Date() < this.expiresAt) {
            try {
                await this.client.request({
                    data: [
                        {
                            operationName: 'AppsPaginatedQuery',
                            variables: {
                                first: 8,
                                accountName: 'abhinavmathur',
                                filter: {
                                    searchTerm: '',
                                    sortByField: 'LATEST_ACTIVITY_TIME'
                                }
                            },
                            query: `query AppsPaginatedQuery($accountName: String!, $after: String, $first: Int, $before: String, $last: Int, $filter: AccountAppsFilterInput) {\n  account {\n    byName(accountName: $accountName) {\n      id\n      appsPaginated(\n        after: $after\n        first: $first\n        before: $before\n        last: $last\n        filter: $filter\n      ) {\n        edges {\n          node {\n            ...AppDataWithRepo\n            __typename\n          }\n          __typename\n        }\n        pageInfo {\n          hasNextPage\n          hasPreviousPage\n          startCursor\n          endCursor\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment AppDataWithRepo on App {\n  ...AppData\n  githubRepository {\n    metadata {\n      githubRepoName\n      githubRepoOwnerName\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment AppData on App {\n  __typename\n  id\n  icon {\n    url\n    primaryColor\n    __typename\n  }\n  iconUrl\n  fullName\n  name\n  slug\n  ownerAccount {\n    name\n    id\n    __typename\n  }\n  githubRepository {\n    githubRepositoryUrl\n    __typename\n  }\n  lastDeletionAttemptTime\n}`
                        }
                    ]
                });
                return this.sessionSecret;
            } catch (e) {
                console.log(e);
            }
        }
        const response = await axios.post(`https://api.expo.dev/v2/auth/loginAsync`, {
            username: this.expoUser,
            password: this.expoPassword
        });
        const {sessionSecret} = response.data.data;
        const {expires_at} = JSON.parse(sessionSecret);
        this.sessionSecret = sessionSecret;
        this.expiresAt = new Date(expires_at);

        return this.sessionSecret;
    }

    protected async getLastBuild(lastAsset: IAsset): Promise<IAsset> {
        await this.getSessionSecret();
        const now = new Date();
        const dayAgo = new Date(now.getTime() - 24 * 3_600_1000);
        // We check only once a day
        if (dayAgo > now && lastAsset instanceof Asset) {
            return lastAsset;
        }
        // We check build version
        const lastBuildVersion = Number(lastAsset.metadata.buildVersion);
        try {
            const builds = await this.client.request<BuildsResponse>({
                data: [
                    {
                        operationName: 'BuildsPaginatedQuery',
                        variables: {
                            fullName: '@abhinavmathur/vibesign-app',
                            first: 12,
                            filter: {
                                platforms: null
                            }
                        },
                        query: `query BuildsPaginatedQuery($fullName: String!, $after: String, $first: Int, $before: String, $last: Int, $filter: BuildFilterInput) {\n  app {\n    byFullName(fullName: $fullName) {\n      id\n      buildsPaginated(\n        after: $after\n        first: $first\n        before: $before\n        last: $last\n        filter: $filter\n      ) {\n        edges {\n          node {\n            ...TableBuild\n            __typename\n          }\n          __typename\n        }\n        pageInfo {\n          hasNextPage\n          hasPreviousPage\n          startCursor\n          endCursor\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment TableBuild on Build {\n  id\n  __typename\n  activityTimestamp\n  createdAt\n  actor {\n    id\n    __typename\n    displayName\n    ... on UserActor {\n      profilePhoto\n      __typename\n    }\n  }\n  app {\n    ...AppData\n    __typename\n  }\n  buildChannel: updateChannel {\n    id\n    name\n    __typename\n  }\n  buildPlatform: platform\n  buildStatus: status\n  buildRuntime: runtime {\n    id\n    version\n    __typename\n  }\n  buildGitCommitHash: gitCommitHash\n  buildGitCommitMessage: gitCommitMessage\n  buildIsGitWorkingTreeDirty: isGitWorkingTreeDirty\n  message\n  expirationDate\n  distribution\n  buildMode\n  customWorkflowName\n  buildProfile\n  gitRef\n  appBuildVersion\n  appVersion\n  metrics {\n    buildDuration\n    __typename\n  }\n  developmentClient\n  isForIosSimulator\n  deployment {\n    id\n    runtime {\n      ...RuntimeBasicInfo\n      __typename\n    }\n    channel {\n      ...UpdateChannelBasicInfo\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment AppData on App {\n  __typename\n  id\n  icon {\n    url\n    primaryColor\n    __typename\n  }\n  iconUrl\n  fullName\n  name\n  slug\n  ownerAccount {\n    name\n    id\n    __typename\n  }\n  githubRepository {\n    githubRepositoryUrl\n    __typename\n  }\n  lastDeletionAttemptTime\n}\n\nfragment RuntimeBasicInfo on Runtime {\n  __typename\n  id\n  version\n}\n\nfragment UpdateChannelBasicInfo on UpdateChannel {\n  __typename\n  id\n  name\n  branchMapping\n  createdAt\n  updatedAt\n  isPaused\n}`
                    }
                ]
            });
            const lastBuild = builds.data.app.byFullName.buildsPaginated.edges.find(e => {
                const n = e.node;
                return n.buildPlatform == 'ANDROID'
                    && n.buildStatus == 'FINISHED'
                    && new Date(n.expirationDate) > now
            })?.node;
            if (!lastBuild || Number(lastBuild.appBuildVersion) < lastBuildVersion) {
                return lastAsset;
            }
            const buildRes = await this.client.request<BuildData>({
                data: [
                    {
                        operationName: 'BuildQuery',
                        variables: {
                            buildId: lastBuild.id
                        },
                        query: `query BuildQuery($buildId: ID!) {\n  builds {\n    byId(buildId: $buildId) {\n      ...Build\n      deployment {\n        id\n        runtime {\n          ...RuntimeBasicInfo\n          __typename\n        }\n        channel {\n          ...UpdateChannelBasicInfo\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment Build on Build {\n  __typename\n  id\n  platform\n  status\n  app {\n    id\n    fullName\n    slug\n    name\n    iconUrl\n    githubRepository {\n      githubRepositoryUrl\n      __typename\n    }\n    ownerAccount {\n      name\n      __typename\n    }\n    __typename\n  }\n  artifacts {\n    applicationArchiveUrl\n    buildArtifactsUrl\n    xcodeBuildLogsUrl\n    __typename\n  }\n  distribution\n  logFiles\n  metrics {\n    buildWaitTime\n    buildQueueTime\n    buildDuration\n    __typename\n  }\n  initiatingActor {\n    id\n    displayName\n    ... on UserActor {\n      username\n      fullName\n      profilePhoto\n      __typename\n    }\n    __typename\n  }\n  createdAt\n  enqueuedAt\n  provisioningStartedAt\n  workerStartedAt\n  completedAt\n  updatedAt\n  expirationDate\n  sdkVersion\n  runtime {\n    id\n    version\n    __typename\n  }\n  updateChannel {\n    id\n    name\n    __typename\n  }\n  buildProfile\n  appVersion\n  appBuildVersion\n  gitCommitHash\n  gitCommitMessage\n  isGitWorkingTreeDirty\n  message\n  resourceClassDisplayName\n  gitRef\n  projectRootDirectory\n  githubRepositoryOwnerAndName\n  projectMetadataFileUrl\n  childBuild {\n    id\n    buildMode\n    __typename\n  }\n  priority\n  queuePosition\n  initialQueuePosition\n  estimatedWaitTimeLeftSeconds\n  submissions {\n    id\n    status\n    canRetry\n    __typename\n  }\n  canRetry\n  retryDisabledReason\n  maxRetryTimeMinutes\n  buildMode\n  customWorkflowName\n  isWaived\n  developmentClient\n  selectedImage\n  customNodeVersion\n  isForIosSimulator\n  resolvedEnvironment\n}\n\nfragment RuntimeBasicInfo on Runtime {\n  __typename\n  id\n  version\n}\n\nfragment UpdateChannelBasicInfo on UpdateChannel {\n  __typename\n  id\n  name\n  branchMapping\n  createdAt\n  updatedAt\n  isPaused\n}`
                    }
                ]
            });
            const buildData = buildRes.data.builds.byId;
            const buildDate = new Date(buildData.createdAt);
            const name = buildDate.toISOString().split('T').shift();
            return this.assets.writeUrl(buildData.artifacts.applicationArchiveUrl, {
                filename: `vibesign-${name}.apk`,
                buildDate,
                buildVersion: buildData.appBuildVersion,
                version: buildData.appVersion,
                notes: buildData.gitCommitMessage || `Enhancements`
            }, {
                ext: 'apk',
                mime: APK_MIME
            });
        } catch (e) {
            console.log(e);
        }
        return lastAsset;
    }
}
