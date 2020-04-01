import { Action } from '../action';

export class PostAction implements Action {
    public static readonly NAME = 'post';
    
    resource_hash: string;
    user: string;
    report_uri: string;
    title: string;
    description: string;
    verdict: boolean;
    
    getActionName(): string { return PostAction.NAME};
}