// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/StreamFilter/ondata
function listener(details) {
    let streamFilter = browser.webRequest.filterResponseData(details.requestId);
    let decoder = new TextDecoder("utf-8");

    // could be used for blocking the reguest 
    // let dataProcessed = false;

    // whole requested data
    let data = [];

    // get data whilst it is downloaded
    // decode and store
    streamFilter.ondata = event => {
        data.push(decoder.decode(event.data, {stream: true}));
        streamFilter.write(event.data);
    }

    // aggregate the data to string
    streamFilter.onstop = event => {
        data.push(decoder.decode());
        let str = data.join("");
        // process data
        console.log(`[Processed req=${details.requestId}]`);
        streamFilter.close();
    }
}

// listen to request
browser.webRequest.onBeforeRequest.addListener(
    listener,
    { urls: ['<all_urls>'], types: ['script'] },
    ['blocking']
);

function onComplete(requestDetails) {
    console.log("[COMPLETE]", requestDetails);
}

// log successfully completed requests
browser.webRequest.onCompleted.addListener(
    onComplete,
    { urls: ['<all_urls>'], types: ['script'] }
);
