$(function () {
    $('#fontColor').on('change paste keyuo', function () {
        const color = $(this).val();

        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { todo: 'changeColor', clickedColor: color });
        });
    });
});