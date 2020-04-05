import { BackgroundHelper } from './background-helper';
import { init } from 'src/environments/environment';

/** 
 * Initialize environment.
 * Set up default configurations depending on 
 * environment mode (dev/production). 
 */
init();

const helper = new BackgroundHelper();

/**
 * Listens to catch downloaded data from web server 
 * before its execution on browser. Then script is 
 * encoded by sha-256 algorith, which result in the
 * form of string is used for querying blockchain for
 * existence or absence related resource and report
 * entries. Final result is stored in browser storage. 
 * 
 * @param details the request details of browser
 * @external https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/StreamFilter/ondata
 */
function listener(details) {
    const streamFilter = browser.webRequest.filterResponseData(details.requestId);
    // keep resource url
    const resourceUrl: string = details.url;
    // aggregated requested data
    const data: ArrayBuffer[] = [];
    // get data whilst it is downloaded
    streamFilter['ondata'] = (event) => {
        data.push(event.data);
        streamFilter['write'](event.data);
    }
    // process data after downloaded
    streamFilter['onstop'] = async (event) => {
        // encode
        const hashHex: string = await helper.encode(data);
        // process data
        console.log(`[Processed req=${details.requestId}]`, resourceUrl);
        // find in blockchain and store to browser storage
        helper.storeResource(details.tabId, hashHex, resourceUrl);
        streamFilter['close']();
    }
}

// listen to request
browser.webRequest.onBeforeRequest.addListener(
    listener,
    { urls: ['<all_urls>'], types: ['script'] },
    ['blocking']
);
