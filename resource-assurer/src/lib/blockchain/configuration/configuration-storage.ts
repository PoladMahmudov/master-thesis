import { JsonRpc, Api } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';

export class ConfigurationEntry {
    rpcUri: string;
    reliabilityThreshold: number = 50; // in percentage
}

/** Browser storage alias for config  */
const configAlias = 'app-config';

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
 * Stores app configuration in browser storage. 
 * Storage given structure below.
 * 
 * `rpcUri` - full uri with port number, etc;
 * 
 * `reliabilityThreshold` - min limit of positive votes 
 * stating the reliability of given report.
 * 
 * @example
 * {
 *      "app-config": {
 *          "rpcUri": "http://localhost:8888",
 *          "reliabilityThreshold": 50
 *      }
 * }
 * 
 * @param config configuration
 */
export async function storeConfiguration(config: ConfigurationEntry): Promise<void> {
    return browser.storage.local
        .set({ [configAlias]: config });
}

/**
 * Retrieve application configuration from browser storage
 * @returns configuration
 */
export async function getConfiguration(): Promise<ConfigurationEntry> {
    return browser.storage.local
        .get(configAlias)
        .then(storage => storage[configAlias]);
}

/**
 * Retrieve RPC URI from browser storage
 * @returns URI
 */
export async function getRpcUri(): Promise<string> {
    return getConfiguration()
        .then(config => config.rpcUri);
}

/**
 * Retrieve Reliability Threshold from browser storage
 * @returns percentages
 */
export async function getReliabilityThreshold(): Promise<number> {
    return getConfiguration()
        .then(config => config ? config.reliabilityThreshold : 50);
}

/**
 * Check Configuration is set
 */
export async function configurationIsSet(): Promise<boolean> {
    return getConfiguration().then(config => !!config);
}

/**
 * Removes configuration info from browser storage
 */
export async function removeConfiguration(): Promise<void> {
    return browser.storage.local
        .remove(configAlias);
}