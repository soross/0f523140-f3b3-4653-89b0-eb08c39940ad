function AfterLogin() {
    $.ajax({
        type: 'POST',
        url: 'user/info/',
        success: function (msg) {
            $(".logined").show();
            $(".logouted").hide();
            $("a#name").html(msg.split(',')[0]);
            $("div#links a:last").attr("href", "profile/" + msg.split(',')[0]);
            var type = msg.split(',')[1];
            if (type == 1) {
                $(".jobs").show();
                $(".recruitment").hide();
                $(".admin").hide();
            }
            else if (type == 2) {
                $(".jobs").hide();
                $(".recruitment").show();
                $(".admin").hide();
            }
            else if (type == 0) {
                $(".admin").show();
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
            url: 'feedback/post',
            data: {
                question: $("#question").val(),
                description: $("#description").val(),
                email: $("#email").val()
            },
            success: function (msg) {
                $("div#feedback-info").dialog("open");
            }
        });
    });
});