import { Action } from '../action';

export class UnvoteAction implements Action {
    public static readonly NAME = 'unvote';

    report_id: number;
    voter: string;

    getActionName(): string {
        return UnvoteAction.NAME;
    }
}