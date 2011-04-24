﻿function AfterLogin() {
    $.ajax({
        type: 'POST',
        url: 'user/info/',
        success: function (msg) {
            msg = $.trim(msg);
            var username = msg.split(',')[0];
            var type = msg.split(',')[1];
            $("#name").html(username);
            $("#my-microbloging").attr("href", "profile/" + username);
            if (type == 1) {
                $(".jobs").show();
            }
            else if (type == 2) {
                $(".recruitment").show();
            }
            else if (type == 99) {
                $(".recruitment").show();
                $(".admin").show();
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
        question: $("#question").val("");
        description: $("#description").val("");
        email: $("#email").val("");
        $("div#feedback-info").dialog("open");
        $.ajax({
            type: 'POST',
            url: 'feedback/post',
            data: {
                question: $("#question").val(),
                description: $("#description").val(),
                email: $("#email").val()
            },
            success: function (msg) {
            }
        });
    });
});