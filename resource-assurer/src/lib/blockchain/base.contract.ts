import { Api, JsonRpc } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';
import { Transaction } from './transaction';
import { Struct } from './struct';

// Base class for all contracts' manipulations
export abstract class BaseContract<S extends Struct> {

    // TODO: retrieve from browser storage
    private readonly rpcUri = 'https://8000-b9318b5e-440b-4e69-8903-ab5a458da359.ws-eu01.gitpod.io';
    private readonly rpcPort = '443';
    private readonly defaultPrivateKey = '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3'; // bob
    protected readonly user = 'bob';

    private readonly signatureProvider: JsSignatureProvider;
    protected readonly rpc: JsonRpc;
    protected readonly api: Api;

    constructor(private readonly accountName: string) {
        this.signatureProvider = new JsSignatureProvider([this.defaultPrivateKey]);
        this.rpc = new JsonRpc(`${this.rpcUri}:${this.rpcPort}`);
        this.api = new Api({
            rpc: this.rpc,
            signatureProvider: this.signatureProvider,
            textDecoder: new TextDecoder(),
            textEncoder: new TextEncoder()
        });
    }

    /**
     * An explanation of how the value should be passed via cleos to derive a result. 
     * This all revolves around endianness. For some reason the checksum256 value 
     * is returned in a different endian to what the index key type bounds for 
     * sha256 expects.
     * If the below hash (checksum256) is returned by a row in the table:
     * 
     * 7af12386a82b6337d6b1e4c6a1119e29bb03e6209aa03c70ed3efbb9b74a290c
     * 
     * It's first split into two parts (16 bytes each side):
     * 
     * 7af12386a82b6337d6b1e4c6a1119e29 bb03e6209aa03c70ed3efbb9b74a290c
     * 
     * Each part is then reversed in 2 character (1 byte) chunks, 
     * using the first part as an example:
     * 
     * 7af12386a82b6337d6b1e4c6a1119e29
     * 
     * 7a f1 23 86 a8 2b 63 37 d6 b1 e4 c6 a1 11 9e 29 
     * 
     * 29 9e 11 a1 c6 e4 b1 d6 37 63 2b a8 86 23 f1 7a
     * 
     * The two reversed parts are then concatenated to form the value 
     * that could used with the sha256 index key type:
     * 
     * 299e11a1c6e4b1d637632ba88623f17a 0c294ab7b9fb3eed703ca09a20e603bb
     * 
     * The final result:
     * 
     * 299e11a1c6e4b1d637632ba88623f17a0c294ab7b9fb3eed703ca09a20e603bb
     * 
     * @param {string} hash code string to be resolved
     * @returns {string} resolved hash
     * @throws Incorrect sha256 code format exception, if provided hash-code has odd length. 
     * @external https://eosio.stackexchange.com/questions/4116/how-to-use-checksum256-secondary-index-to-get-table-rows
     */
    protected prepareSearchingHash(hash: string): string {
        // divide in two
        if (hash.length % 2 > 0)
            throw `Incorrect sha256 code format. 
            Length should be even, but it\'s ${hash.length / 2}`;
        const part1 = this.changeEndianness(hash.substr(0, hash.length / 2));
        const part2 = this.changeEndianness(hash.substr(hash.length / 2, hash.length));
        return part1 + part2;
    }

    /**
     * Changes endianness of the given string.
     * Reverts back by 2 chars in a string.
     * 
     * @example '0A|1B|2D|3C' => '3C|2D|1B|0A'
     * @param str to be reverted (for example '0A1B2D3C')
     */
    protected changeEndianness(str: string) {
        const result = [];
        let len = str.length - 2;
        while (len >= 0) {
            result.push(str.substr(len, 2));
            len -= 2;
        }
        return result.join('');
    }

    /**
     * Creates transaction object for contract action action
     * @param data payload of a transaction 
     */
    protected createTransaction(data: S): Transaction<S> {
        return {
            actions: [{
                account: this.accountName,
                name: 'publish',
                authorization: [{
                    actor: this.user,
                    permission: 'active',
                }],
                data: { ...data, user: this.user },
            }]
        }
    }
}