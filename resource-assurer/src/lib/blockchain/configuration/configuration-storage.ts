import { JsonRpc, Api } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';

/** Browser storage alias for RPC config  */
const rpcUriAlias = 'rpc-uri';

/**
 * Create EOSJS RPC with configurations 
 * from browser storage.
 */
export function getRpc(): Promise<JsonRpc> {
    return getRpcUri()
        .then(rpc => new JsonRpc(rpc));
}

/**
 * Create EOSJS API with configurations 
 * from browser storage.
 * Note: JsonSignatureProvide is not set.
 */
export async function getApi(): Promise<Api> {
    return new Api({
        rpc: await getRpc(),
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
export async function storeRpcUri(rpcUri: string): Promise<void> {
    return browser.storage.local
        .set({ [rpcUriAlias]: rpcUri });
}

/**
 * Retrieve RPC URI from browser storage
 * @returns URI
 */
export async function getRpcUri(): Promise<string> {
    return browser.storage.local
        .get(rpcUriAlias)
        .then(storage => storage[rpcUriAlias]);
}

/**
 * Check RPC URI is set
 */
export async function rpcUriIsSet(): Promise<boolean> {
    return getRpcUri().then(rpc => !!rpc);
}

/**
 * Removes RPC configuration info from browser storage
 */
export async function removeRpcUri(): Promise<void> {
    return browser.storage.local
        .remove(rpcUriAlias);
}