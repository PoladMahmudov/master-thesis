import { Action } from '../action';

export class CleanAction implements Action {
    public static readonly NAME = 'clean';

    report_id: number;
    /** 
     * Number of elements to clean.
     * 
     * Cleaning of the blockchain from unused data.
     * This data is mostly votes given to the report,
     * which became useless after the report is expired.
     * Clean is done over RAM storage.
    */
    max_count: number;

    getActionName(): string {
        return CleanAction.NAME;
    }
}