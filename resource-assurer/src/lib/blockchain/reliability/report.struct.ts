import { Struct } from '../struct';

export class ReportStruct implements Struct {
    id?: number;
    resource_hash: string;
    user: string;
    report_uri: string;
    description: string;
    verdict: boolean;
}