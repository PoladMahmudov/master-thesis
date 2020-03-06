import { ReportStruct } from './report.struct';
import { TableResponse } from '../table-response';
import { ReportRequest } from './report-request';
import { RpcError } from 'eosjs';
import { BaseContract } from '../base.contract';

export class ReliabilityContract extends BaseContract<ReportStruct> {

    constructor() {
        super('reliability');
    }

    /**
     * Find reports for given resource-hash
     * @param resourceHash is a sha256 string parameter
     * @returns rows array with either empty or reports value
     */
    public async find(resourceHash: string): Promise<TableResponse<ReportStruct>> {
        const searchingHash = this.prepareSearchingHash(resourceHash);
        return await this.rpc.get_table_rows(new ReportRequest(searchingHash));
    }

}