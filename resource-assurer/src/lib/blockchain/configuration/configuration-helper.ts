import { JsonRpc, Api } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';

export class ConfigurationHelper {

    /** Browser storage alias for RPC config  */
    public static readonly RPC_URI_ALIAS = 'rpc-uri';

    /**
     * Create EOSJS RPC with configurations 
     * from browser storage.
     */
    public async getRpc(): Promise<JsonRpc> {
        return this.getRpcUri()
            .then(rpc => new JsonRpc(rpc));
    }

    /**
     * Create EOSJS API with configurations 
     * from browser storage.
     * Note: JsonSignatureProvide is not set.
     */
    public async getApi(): Promise<Api> {
        return new Api({
            rpc: await this.getRpc(),
            signatureProvider: new JsSignatureProvider([]),
            textDecoder: new TextDecoder(),
            textEncoder: new TextEncoder()
        });
    }

    /**
     * Stores blockchain URI for RPC configuration in
     * browser storage. Storage structure below.
     * 
     * @example
     * {
     *      "rpc-uri": "http://localhost:8888"
     * }
     * 
     * @param rpcUri full uri with port number, etc.
     */
    public async storeRpcUri(rpcUri: string): Promise<void> {
        return browser.storage.local
            .set({ [ConfigurationHelper.RPC_URI_ALIAS]: rpcUri });
    }

    /**
     * Retrieve RPC URI from browser storage
     * @returns URI
     */
    public async getRpcUri(): Promise<string> {
        return browser.storage.local
            .get(ConfigurationHelper.RPC_URI_ALIAS)
            .then(storage => storage[ConfigurationHelper.RPC_URI_ALIAS]);
    }

    /**
     * Check RPC URI is set
     */
    public async rpcUriIsSet(): Promise<boolean> {
        return this.getRpcUri().then(rpc => !!rpc);
    }

    /**
     * Removes RPC configuration info from browser storage
     */
    public async removeRpcUri(): Promise<void> {
        return browser.storage.local
            .remove(ConfigurationHelper.RPC_URI_ALIAS);
    }
}