$(function () {
    chrome.storage.sync.get(['total', 'limit'], function (budget) {
        $('#js-total-number').text(budget.total);
        $('#js-limit-number').text(budget.limit);
    });

    $('#js-button').click(function () {
        chrome.storage.sync.get(['total', 'limit'], function (budget) {
            let budgetTotal = budget.total;
            budgetTotal = budgetTotal ? parseInt(budgetTotal) : 0;
            let newAmount = $('#js-input').val();

            if (newAmount) {
                budgetTotal += parseInt(newAmount);
            }

            chrome.storage.sync.set({ 'total': budgetTotal }, function () {
                if(newAmount && budgetTotal >= budget.limit) {
                    const notifOptions = {
                        type: 'basic',
                        iconUrl: 'icon48.png',
                        title: 'Limit reached!',
                        message: 'Uh oh! Looks like you\'ve reached your limit'
                    };
                    chrome.notifications.create('limitNotif', notifOptions);
                    chrome.notifications.clear('limitNotif'); 
                }
            });
            $('#js-total-number').text(budgetTotal);
            $('#js-input').val('');
        });
    });
});
