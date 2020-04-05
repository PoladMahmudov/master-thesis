import { Struct } from '../struct';

export class VoteStruct implements Struct {
    public static readonly TABLE_NAME = 'votes';

    id: number;
    report_id: number;
    voter: string;
    vote: number;
    updated_at: number; // timestamp

    getTableName(): string {
        return VoteStruct.TABLE_NAME;
    }
}