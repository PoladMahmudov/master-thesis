import { ContractBase } from '../contract-base';
import { TableResponse } from '../table-response';
import { ResourceStruct } from './resource.struct';
import { RpcError } from 'eosjs';
import { ResourceRequest } from './resource-request';
import { Transaction } from '../transaction';

export class IntegrityContract extends ContractBase {

    /**
     * Find resource by hash
     * @param resourceHash is a sha256 string parameter
     * @returns rows array with either empty or single resource value
     */
    public async findResource(resourceHash: string): Promise<TableResponse<ResourceStruct>> {
        return await this.rpc.get_table_rows(new ResourceRequest(resourceHash));
    }

    /**
     * Publishes new resource data
     * @param data is a raw resource structure
     */
    public async publish(data: ResourceStruct): Promise<void> {
        const transaction = this.createTransaction(data, this.user);
        try {
            const result = await this.api.transact(
                transaction,
                { blocksBehind: 3, expireSeconds: 30 }
            );
            // TODO: browser notify
            console.log('Resource publish result', result);
        } catch (e) {
            // TODO: browser notify
            console.error('Caught exception: ' + e);
            if (e instanceof RpcError)
                console.error(JSON.stringify(e.json, null, 2));
        }
    }

    // create transaction for resource publishing action
    private createTransaction(data: ResourceStruct, user: string): Transaction<ResourceStruct> {
        return {
            actions: [{
                account: 'integrity',
                name: 'publish',
                authorization: [{
                    actor: user,
                    permission: 'active',
                }],
                data: data,
            }]
        }
    }
}