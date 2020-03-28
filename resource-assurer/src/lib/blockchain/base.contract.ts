import { Api, JsonRpc, RpcError } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';
import { Transaction } from './transaction';
import { Struct } from './struct';
import { TableResponse } from './table-response';

/** Base class for all contracts' manipulations */
export abstract class BaseContract {

    // TODO: retrieve from browser storage
    // private readonly rpcUri = 'https://8000-aa599c0c-ffe6-4977-b44f-aa904bdd6962.ws-eu01.gitpod.io';
    // private readonly rpcPort = '443';
    private readonly rpcUri = 'http://localhost';
    private readonly rpcPort = '8888';
    private readonly defaultPrivateKey = '5KdbsD6en43rKfBFbHLbJbj1LeFpHNxg7KaE2nRsJCoFSkuxibr';
    private readonly user = 'assurer';

    protected readonly rpc: JsonRpc;
    private readonly signatureProvider: JsSignatureProvider;
    private readonly api: Api;

    constructor(private readonly account: string) {
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
     * Commits transaction with struct
     * @param action name of the action
     * @param struct is a raw contract structure
     */
    protected async transact<S extends Struct>(action: string, struct: S): Promise<void> {
        const transaction = this.createTransaction(action, struct);
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

    /**
     * Creates transaction object for contract action
     * @param data payload of a transaction 
     */
    private createTransaction<S extends Struct>(action: string, data: S): Transaction<S> {
        return {
            actions: [{
                account: this.account,  
                name: action,
                authorization: [{
                    actor: this.user,
                    permission: 'active',
                }],
                data: { ...data, user: this.user },
            }]
        }
    }
}