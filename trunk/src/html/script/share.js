//User Login - share.js
var logined = false;

$(function () {
    InitUser();

    $("input#search-text").focusin(function () {
        $("#sorts").fadeOut(200);
        $(this).css("color", "#000000");
        if ($(this).val() == "职位关键字，如：北京 产品经理 阿里巴巴") {
            $(this).val("");
        }
    });
    $("input#search-text").focusout(function () {
        $(this).css("color", "#adadad");
        if ($(this).val() == "") {
            $(this).val("职位关键字，如：北京 产品经理 阿里巴巴");
        }
    });
});

function InitUser() {
    auth = $.cookie("USER_AUTH");
    if (auth == null) {
        logined = false;
    }
    else {
        logined = true;
    }
    if (logined) {
        $(".logined").show();
        AfterLogin();
    }
    else {
        $(".logouted").show();
    }
}
//End of User Login