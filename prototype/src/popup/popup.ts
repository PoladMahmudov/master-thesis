require('./popup.scss');
import { MessageType } from "../message/message.type";

// resources to publish for integrity
const resources: any[] = [];
// resources

// sink messages here from background on resource data download
browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type === MessageType.RESOURCES) {
        resources.push(request);
    }
});
