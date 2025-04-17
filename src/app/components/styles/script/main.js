$(function () {
    var overlay = $('<div id="overlay"></div>')
    var popup = $('.popupp');
    
    $('#BookBtn2').click(function () {
    popup.show();
    overlay.appendTo(document.body);
    return false;
    });
    $('#BookBtn3').click(function () {
    popup.show();
    overlay.appendTo(document.body);
    return false;
    });
    $('.close, .x').click(function () {
    popup.hide();
    overlay.appendTo(document.body).remove();
    return false;
    });
    });
    