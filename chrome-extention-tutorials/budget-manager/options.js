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
        chrome.storage.sync.set({ 'total': 0 });
    });

});
