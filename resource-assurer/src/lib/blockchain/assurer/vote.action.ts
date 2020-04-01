import { Action } from '../action';

export class VoteAction implements Action {
    public static readonly NAME = 'vote';

    report_id: number;
    voter: string;
    vote: boolean;

    getActionName(): string {
        return VoteAction.NAME;
    }
}