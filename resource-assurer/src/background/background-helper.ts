import { IntegrityContract } from 'src/lib/blockchain/integrity/integrity.contract';

export class BackgroundHelper {

    private readonly integrityContract: IntegrityContract;

    constructor() {
        this.integrityContract = new IntegrityContract();
    }

    // https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
    public async encodeSha256(data: ArrayBuffer[]): Promise<string> {
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

    /**
     * Check integrity of a resource in blockchain
     * @param shaCode hex string representing sha256 code of resource
     * @returns true if it's defined in blockchain, otherwise false
     */
    public async checkIntegrity(shaCode: string): Promise<boolean> {
        const response = await this.integrityContract.findResource(shaCode);
        return response.rows.length > 0;
    }
}