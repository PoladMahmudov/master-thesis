import { RpcError } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';
import { Transaction } from './transaction';
import { Action } from './action';
import { getApi } from './configuration/configuration-storage';
import { getCurrentAccount } from './configuration/account-storage';

/** Base class for all contracts' manipulations */
export abstract class BaseContract {

    constructor(private readonly contractAccount: string) {
    }

    /**
     * Commits transaction
     * @param action name of the action
     * @param actionName name of the action
     */
    protected async transact<A extends Action>(action: A, actionName: string): Promise<void> {
        const userAccount = await getCurrentAccount();
        const api = await getApi();
        api.signatureProvider = new JsSignatureProvider([userAccount.privateKey]);

        const transaction = this.createTransaction(action, userAccount.name, actionName);
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
    private createTransaction<A extends Action>(action: A, actor: string, actionName: string): Transaction<A> {
        return {
            actions: [{
                account: this.contractAccount,
                name: actionName,
                authorization: [{
                    actor: actor,
                    permission: 'active',
                }],
                data: action,
            }]
        }
    }
}