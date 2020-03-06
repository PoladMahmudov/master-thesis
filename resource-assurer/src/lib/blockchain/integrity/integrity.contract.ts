import { TableResponse } from '../table-response';
import { ResourceStruct } from './resource.struct';
import { RpcError } from 'eosjs';
import { ResourceRequest } from './resource-request';
import { BaseContract } from '../base.contract';

export class IntegrityContract extends BaseContract<ResourceStruct> {

    constructor() {
        super('integrity');
    }

    /**
     * Find resource by hash
     * @param resourceHash is a sha256 string parameter
     * @returns rows array with either empty or single resource value
     */
    public async find(resourceHash: string): Promise<TableResponse<ResourceStruct>> {
        const searchingHash = this.prepareSearchingHash(resourceHash);
        return await this.rpc.get_table_rows(new ResourceRequest(searchingHash));
    }
}
