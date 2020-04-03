import { RpcError } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';
import { Transaction } from './transaction';
import { Action } from './action';
import { AccountStorageHelper } from './configuration/account-storage-helper';
import { ConfigurationHelper } from './configuration/configuration-helper';

/** Base class for all contracts' manipulations */
export abstract class BaseContract {

    protected readonly accountHelper = new AccountStorageHelper();
    protected readonly configuration = new ConfigurationHelper();

    constructor(private readonly account: string) {
    }

    /**
     * Commits transaction
     * @param action name of the action
     * @param payload is a raw contract action payload
     */
    protected async transact<A extends Action>(action: A): Promise<void> {
        const account = await this.accountHelper.getCurrent();
        const api = await this.configuration.getApi();
        api.signatureProvider = new JsSignatureProvider([account.privateKey]);
        
        const transaction = this.createTransaction(action, account.name);
        try {
            const result = await api.transact(
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
     * @param action payload of a transaction 
     */
    private createTransaction<A extends Action>(action: A, actor: string): Transaction<A> {
        return {
            actions: [{
                account: this.account,
                name: action.getActionName(),
                authorization: [{
                    actor: actor,
                    permission: 'active',
                }],
                data: { ...action },
            }]
        }
    }
}