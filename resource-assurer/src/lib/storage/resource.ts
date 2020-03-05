import { ResourceStateType } from './resource-state.type';
import { ResourceStatusType } from './resource-status.type';

export class Resource {
    tabId: number;
    resourceHash: string;
    resourceUrl: string;
    resourceRepoUrl: string;
    state: ResourceStateType;
    status: ResourceStatusType;
}