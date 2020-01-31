chrome.runtime.sendMessage({ todo: 'showPageAction' });

chrome.runtime.onMessage.addListener(function (request, sender, senderResponse) {
    if (request.todo == 'changeColor') {
        const addColor = '#' + request.clickedColor + ' !important';
        $('.article-content').css('color', addColor);
    }
});