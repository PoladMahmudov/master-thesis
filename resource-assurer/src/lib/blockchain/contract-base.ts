import { Api, JsonRpc } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';

// Base class for all contracts manipulations
export class ContractBase {

    // TODO: retrieve from browser storage
    private readonly rpcUri = 'https://8000-b9318b5e-440b-4e69-8903-ab5a458da359.ws-eu01.gitpod.io';
    private readonly rpcPort = '443';
    private readonly defaultPrivateKey = "5JtUScZK2XEp3g9gh7F8bwtPTRAkASmNrrftmx4AxDKD5K4zDnr"; // bob
    protected readonly user = 'bob';

    private readonly signatureProvider: JsSignatureProvider;
    protected readonly rpc: JsonRpc;
    protected readonly api: Api;

    constructor() {
        this.signatureProvider = new JsSignatureProvider([this.defaultPrivateKey]);
        this.rpc = new JsonRpc(`${this.rpcUri}:${this.rpcPort}`, { fetch });
        this.api = new Api({
            rpc: this.rpc,
            signatureProvider: this.signatureProvider,
            textDecoder: new TextDecoder(),
            textEncoder: new TextEncoder()
        });
    }
}