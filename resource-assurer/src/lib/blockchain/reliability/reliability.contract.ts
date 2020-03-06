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
    public async findReports(resourceHash: string): Promise<TableResponse<ReportStruct>> {
        const searchingHash = this.prepareSearchingHash(resourceHash);
        return await this.rpc.get_table_rows(new ReportRequest(searchingHash));
    }

    /**
     * Publishes new report data
     * @param data is a raw report structure
     */
    public async publish(data: ReportStruct): Promise<void> {
        const transaction = this.createTransaction(data);
        try {
            const result = await this.api.transact(
                transaction,
                { blocksBehind: 3, expireSeconds: 30 }
            );
            // TODO: browser notify
            console.log('[Transaction result]', result);
        } catch (e) {
            // TODO: browser notify
            console.error('[Caught exception]' + e);
            if (e instanceof RpcError)
                console.error(JSON.stringify(e.json, null, 2));
        }
    }

}