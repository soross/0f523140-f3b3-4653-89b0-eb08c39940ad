function AfterLogin() {
    $.ajax({
        type: 'POST',
        url: '/user/info/',
        success: function (msg) {
            msg = $.trim(msg);
            var username = msg.split(',')[0];
            var type = msg.split(',')[1];
            $("#name").html(username);
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