import { Struct } from '../struct';

export class ResourceStruct implements Struct {
    public static readonly TABLE_NAME = 'resources';

    readonly id: number;
    readonly hash: string;
    readonly uri: string;
    readonly repo_uri: string;
    readonly user: string;
}

export class ReportStruct implements Struct {
    public static readonly TABLE_NAME = 'reports';

    readonly id: number;
    readonly resource_hash: string;
    readonly user: string;
    readonly report_uri: string;
    readonly title: string;
    readonly description: string;
    readonly verdict: boolean;
    readonly created_on: number; // timestamp
    readonly expires_on: number; // timestamp
    readonly ratio: number; // positive votes divided to all
}

export class VoteStruct implements Struct {
    public static readonly TABLE_NAME = 'votes';

    readonly id: number;
    readonly report_id: number;
    readonly voter: string;
    readonly vote: number;
    readonly updated_at: number; // timestamp
}