var deleteitem;
var deleteid;

$(function () {
    $("a.manager-control").click(function () {
        $("a.manager-control").removeClass("manager-control-choose");
        $(this).addClass("manager-control-choose");
    });
    $(".logined").show();
    $(".item-blog-title").click(function () {
        var item = $(this).parent().next(".item-blog-content");
        if (item.hasClass("close")) {
            item.slideDown(200);
            item.removeClass("close");
        }
        else {
            item.slideUp(200);
            item.addClass("close");
        }
    });
});

function ShowNormal() {
}

function ShowFeedback() {
}

function ShowHot() { 
}