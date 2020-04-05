import { Resource } from 'src/lib/resource-manager/resource-storage';
import { fetchAndStoreResource } from 'src/lib/resource-manager/resource-manager';

export class BackgroundHelper {

    constructor() {
    }

    // https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
    public async encode(data: ArrayBuffer[]): Promise<string> {
        // aggregate
        let buffer = await new Blob(data)['arrayBuffer']();
        // encrypt
        const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
        // convert buffer to byte array
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        // convert bytes to hex string              
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        return hashHex;
    }

    public async storeResource(tabId: number, hash: string, uri: string): Promise<Resource> {
        return fetchAndStoreResource(tabId, hash, uri);
    }
}