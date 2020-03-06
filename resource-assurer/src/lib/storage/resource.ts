import { ResourceStateType } from './resource-state.type';
import { Report } from './report';

export class Resource {
    tabId: number;
    resourceHash: string;
    resourceUrl: string;
    resourceRepoUrl?: string;
    state: ResourceStateType;
    owner?: string;
    reports: Report[];
}