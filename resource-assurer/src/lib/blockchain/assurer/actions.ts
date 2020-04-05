import { Action } from '../action';

export class PublishAction implements Action {
    public static readonly NAME = 'publish';

    hash: string;
    uri: string;
    repo_uri: string;
    user: string;
}

export class PostAction implements Action {
    public static readonly NAME = 'post';
    
    resource_hash: string;
    user: string;
    report_uri: string;
    title: string;
    description: string;
    verdict: boolean;
}

export class VoteAction implements Action {
    public static readonly NAME = 'vote';

    report_id: number;
    voter: string;
    vote: boolean;
}

export class UnvoteAction implements Action {
    public static readonly NAME = 'unvote';

    report_id: number;
    voter: string;
}

export class ExpireAction implements Action {
    public static readonly NAME = 'expire';

    report_id: number;
}

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
}