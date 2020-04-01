import { Struct } from '../struct';

export class ReportStruct implements Struct {
    public static readonly TABLE_NAME = 'reports';

    id: number;
    resource_hash: string;
    user: string;
    report_uri: string;
    title: string;
    description: string;
    verdict: boolean;
    created_on: number; // timestamp
    expires_on: number; // timestamp
    ratio: number; // positive votes divided to all

    getTableName(): string {
        return ReportStruct.TABLE_NAME;
    }
}