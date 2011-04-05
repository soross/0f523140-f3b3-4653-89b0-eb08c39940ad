function AfterLogin() {
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