$(function () {

    chrome.storage.sync.get('limit', function (obj) {
        $('#limit').val(obj.limit);
    });

    $('#saveLimit').click(function () {
        const limit = $('#limit').val();

        if (limit) {
            chrome.storage.sync.set({ 'limit': limit }, function () {
                close();
            });
        }
    });

    $('#resetTotal').click(function () {
        chrome.storage.sync.set({ 'total': 0 }, function () { 
            const notifOptions = {
                type: 'basic',
                iconUrl: 'icon48.png',
                title: 'Total reset!',
                message: 'Your total has been reset to 0'
            };
            chrome.notifications.create('limitNotif', notifOptions);
            chrome.notifications.clear('limitNotif'); // clear it to have again next time
         });
    });

});
