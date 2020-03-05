import { BackgroundHelper } from './background-helper';
import { Resource } from 'src/lib/storage/resource';
import { ResourceStateType } from 'src/lib/storage/resource-state.type';
import { ResourceStatusType } from 'src/lib/storage/resource-status.type';
import { BrowserStorageHelper } from 'src/lib/storage/browser-storage-helper';
import { ResourceStruct } from 'src/lib/blockchain/integrity/resource.struct';

const helper = new BackgroundHelper();
const storage = new BrowserStorageHelper();

// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/StreamFilter/ondata
function listener(details) {
    const streamFilter = browser.webRequest.filterResponseData(details.requestId);
    // keep resource url
    const resourceUrl: string = details.url;
    // aggregated requested data
    const data: ArrayBuffer[] = [];
    // get data whilst it is downloaded
    streamFilter['ondata'] = event => {
        data.push(event.data);
        streamFilter['write'](event.data);
    }
    // process data after downloaded
    streamFilter['onstop'] = async event => {
        // encode
        const hashHex: string = await helper.encodeSha256(data);
        // process data
        console.log(`[Processed req=${details.requestId}]`, resourceUrl);
        // find in blockchain
        const foundInBlockchain: ResourceStruct = await helper.getResource(hashHex);
        // resource status & state
        let state = ResourceStateType.UNPUBLISHED;
        let status = ResourceStatusType.WARNING;
        let repoUri: string;

        if (foundInBlockchain) {
            // TODO: check for reliability
            state = ResourceStateType.PUBLISHED;
            repoUri = foundInBlockchain.repo_uri;
        }

        const resource: Resource = {
            tabId: details.tabId,
            resourceHash: hashHex,
            resourceUrl: resourceUrl,
            resourceRepoUrl: repoUri,
            state: state,
            status: status
        };
        // store to browser storage
        setTimeout(() => storage.store(resource), 500);
        streamFilter['close']();
    }
}

// listen to request
browser.webRequest.onBeforeRequest.addListener(
    listener,
    { urls: ['<all_urls>'], types: ['script'] },
    ['blocking']
);

// function onComplete(requestDetails) {
//     console.log("[COMPLETE]", requestDetails);
// }

// // log successfully completed requests
// browser.webRequest.onCompleted.addListener(
//     onComplete,
//     { urls: ['<all_urls>'], types: ['script'] }
// );
