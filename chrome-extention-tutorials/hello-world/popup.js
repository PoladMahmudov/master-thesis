$(function() {
    $('#js-input').keyup(function() {
        $('#js-greet').text('Hello ' + $('#js-input').val())
    })
})
