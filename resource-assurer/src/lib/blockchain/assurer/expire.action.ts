import { Action } from '../action';

export class ExpireAction implements Action {
    public static readonly NAME = 'expire';

    report_id: number;
    
    getActionName(): string {
        return ExpireAction.NAME;
    }

}