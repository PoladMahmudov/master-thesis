import { Action } from '../action';

export class PublishAction implements Action {
    public static readonly NAME = 'publish';

    hash: string;
    uri: string;
    repo_uri: string;
    user: string;
    
    getActionName(): string {
        return PublishAction.NAME;
    }
}