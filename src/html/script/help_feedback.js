﻿function AfterLogin() {
    $.ajax({
        type: 'POST',
        url: 'info/',
        success: function (msg) {
            $(".logined").show();
            $(".logouted").hide();
            $("a#name").html(msg.split(',')[0]);
            $("div#links a:last").attr("href", "profile/" + msg.split(',')[0]);
            var type = msg.split(',')[1];
            if (type == 1) {
                $(".jobs").show();
                $(".recruitment").hide();
            }
            else {
                $(".jobs").hide();
                $(".recruitment").show();
            }
        }
    });
}

$(function () {
    $("div#feedback-info").dialog({
        autoOpen: false,
        buttons: {
            "确定": function () {
                $(this).dialog("close");
            }
        }
    });

    $("div#inner-content a").click(function () {
        $.ajax({
            type: 'POST',
            url: 'feedback',
            data: {
                question: $("#question").val(),
                description: $("#description").val(),
                email: $("#email").val()
            },
            success: function () {
                $("div#feedback-info").dialog("open");
            }
        });
    });
});