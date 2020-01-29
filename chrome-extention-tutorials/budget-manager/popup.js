$(function () {
    chrome.storage.sync.get(['total', 'limit'], function (budget) {
        $('#js-total-number').text(budget.total);
        $('#js-limit-number').text(budget.limit);
    });

    $('#js-button').click(function () {
        chrome.storage.sync.get('total', function (budget) {
            let budgetTotal = budget.total;
            budgetTotal = budgetTotal ? parseInt(budgetTotal) : 0;
            let newAmount = $('#js-input').val();

            if (newAmount) {
                budgetTotal += parseInt(newAmount);
                chrome.storage.sync.set({ 'total': budgetTotal });
                $('#js-total-number').text(budgetTotal);
            }
        });
    });
});
