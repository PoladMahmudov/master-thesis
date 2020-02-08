import { BackgroundHelper } from './background-helper';
import { MessageType } from '../message/message.type';
import { ResourceStateType as ResourceStateType } from '../message/resource-state.type';
import { ResourceStatusType } from '../message/resource-status.type';

const helper = new BackgroundHelper();

// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/StreamFilter/ondata
function listener(details) {
    const streamFilter = browser.webRequest.filterResponseData(details.requestId);

    // keep resource url
    const resourceUrl: string = details.url;
    // used for messaging
    const tabId: number = details.tabId;

    // could be used for blocking the request 
    // let dataProcessed = false;

    // aggregated requested data
    const data: ArrayBuffer[] = [];

    // get data whilst it is downloaded
    streamFilter['ondata'] = event => {
        data.push(event.data);
        streamFilter['write'](event.data);
    }

    streamFilter['onstop'] = async event => {
        // encode
        const hashHex: string = await helper.encodeSha256(data);
        // process data
        console.log(`[Processed req=${details.requestId}]`, resourceUrl);
        // find in blockchain
        const foundInBlockchain: boolean = await helper.checkIntegrity(hashHex);
        // resource status
        let state: ResourceStateType = ResourceStateType.UNPUBLISHED;
        let status: ResourceStatusType = ResourceStatusType.WARNING;

        if (foundInBlockchain) {
            // TODO: check for reliability
            state = ResourceStateType.PUBLISHED;
        }

        browser.tabs.sendMessage(
            tabId,
            {
                type: MessageType.RESOURCES,
                resourceHash: hashHex,
                resourceUrl: resourceUrl,
                state: state,
                status: status
            }
        );
        
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
