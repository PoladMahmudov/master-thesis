const contextMenuItem = {
    'id': 'sendMoney',
    'title': 'SpendMoney',
    'contexts': ['selection']
}

chrome.contextMenus.create(contextMenuItem);

function isInt(value) {
    return !isNaN(value) &&
        parseInt(Number(value)) == value &&
        !isNaN(parseInt(value, 10));
}

chrome.contextMenus.onClicked.addListener(function (clickData) {
    if (clickData.menuItemId == contextMenuItem.id && clickData.selectionText) {
        if (isInt(clickData.selectionText)) {
            chrome.storage.sync.get(['limit', 'total'], function (budget) {
                let newTotal = 0;
                if (budget.total) {
                    newTotal += parseInt(budget.total);
                }
                newTotal += parseInt(clickData.selectionText);
                chrome.storage.sync.set({ 'total': newTotal }, function () {
                    if (newTotal >= budget.limit) {
                        const notifOptions = {
                            type: 'basic',
                            iconUrl: 'icon48.png',
                            title: 'Limit reached!',
                            message: 'Uh oh! Looks like you\'ve reached your limit'
                        }
                        chrome.notifications.create('limitNotif', notifOptions);
                    }
                });
            });
        }
    }
});