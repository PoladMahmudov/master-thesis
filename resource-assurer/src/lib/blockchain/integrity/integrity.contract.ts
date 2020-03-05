import { ContractBase } from '../contract-base';
import { TableResponse } from '../table-response';
import { ResourceStruct } from './resource.struct';
import { RpcError } from 'eosjs';
import { ResourceRequest } from './resource-request';
import { Transaction } from '../transaction';

export class IntegrityContract extends ContractBase {

    constructor() {
        super();
    }

    /**
     * Find resource by hash
     * @param resourceHash is a sha256 string parameter
     * @returns rows array with either empty or single resource value
     */
    public async findResource(resourceHash: string): Promise<TableResponse<ResourceStruct>> {
        const searchingHash = this.prepareSearchingHash(resourceHash);
        return await this.rpc.get_table_rows(new ResourceRequest(searchingHash));
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
            console.log('[Transaction result]', result);
        } catch (e) {
            // TODO: browser notify
            console.error('[Caught exception]' + e);
            if (e instanceof RpcError)
                console.error(JSON.stringify(e.json, null, 2));
        }
    }

    // reformat hash
    // https://eosio.stackexchange.com/questions/4116/how-to-use-checksum256-secondary-index-to-get-table-rows
    private prepareSearchingHash(hash: string): string {
        // divide in two
        if (hash.length % 2 > 0)
            throw `Incorrect sha256 code format. 
            Length should be even, but it\'s ${hash.length / 2}`;
        const part1 = this.changeEndianness(hash.substr(0, hash.length / 2));
        const part2 = this.changeEndianness(hash.substr(hash.length / 2, hash.length));
        return part1 + part2;
    }

    // 0A1B2D3C => 3C2D1B0A
    private changeEndianness(str: string) {
        const result = [];
        let len = str.length - 2;
        while (len >= 0) {
            result.push(str.substr(len, 2));
            len -= 2;
        }
        return result.join('');
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
                data: { ...data, user: user },
            }]
        }
    }
}