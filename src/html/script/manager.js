var deleteitem;
var deleteid;
var deleteurl;

$(function () {
    $("div#content-middle-delete a").animate({ opacity: 0.6 }, 0);
    $("div#content-middle-delete a").mouseover(function () {
        $(this).stop().animate({ opacity: 1 }, 200);
    });
    $("div#content-middle-delete a").mouseout(function () {
        $(this).stop().animate({ opacity: 0.6 }, 200);
    });

    $("a.manager-control").click(function () {
        $("a.manager-control").removeClass("manager-control-choose");
        $(this).addClass("manager-control-choose");
    });
    $("a#jobs-publish-button").click(function () {
        ShowJobsPublish();
    });
    $("a#recruitment-publish-button").click(function () {
        ShowRecruitmentPublish();
    });
    $("input.info-content-words").focusin(function () {
        $(this).addClass("info-content-words-focus");
        if ($(this).val() == $(this).attr("title")) {
            $(this).val("");
        }
    });
    $("input.info-content-words").focusout(function () {
        $(this).removeClass("info-content-words-focus");
        if ($(this).val() == "") {
            $(this).val($(this).attr("title"));
        }
    });
});

function ShowProfile() {
    $("div#profile").show();
    $("div#blogs").hide();
    $("div#profile-control").show();
    $("div#ads").hide();
}

function ShowApply() {
    $("div#profile").hide();
    $("div#blogs").show();
    $("div#profile-control").hide();
    $("div#ads").show();
}
function ShowFavourite() {
    $("div#profile").hide();
    $("div#blogs").show();
    $("div#profile-control").hide();
    $("div#ads").show();
    $.ajax({
        type: 'POST',
        url: 'like/show/0',
        success: function (msg) {
            $("div#blogsinner").html(msg);
            $("div.item").mouseover(function () {
                $(this).addClass("item-over");
            });
            $("div.item").mouseout(function () {
                $(this).removeClass("item-over");
            });
            $("a.delete").click(function () {
                deleteitem = $(this).parent().parent().parent();
                deleteid = deleteitem.attr("id");
                deleteurl = 'like/delete/';
                $("#delete-dialog").dialog("open");
            });
            $("div.item-delete a").click(function () {
                deleteitem = $(this).parent().parent();
                deleteid = $(this).attr("id");
                deleteurl = 'like/delete/';
                $("#delete-dialog").dialog("open");
            });
        }
    });
}

function ShowNormal() {
    $("div#profile").hide();
    $("div#blogs").show();
    $("div#profile-control").hide();
    $("div#ads").show();
    $.ajax({
        type: 'POST',
        url: 'user/current/0/0',
        success: function (msg) {
            $("div#blogsinner").html(msg);
            $("div.item").mouseover(function () {
                $(this).addClass("item-over");
            });
            $("div.item").mouseout(function () {
                $(this).removeClass("item-over");
            });
            $("a.delete").click(function () {
                deleteitem = $(this).parent().parent().parent();
                deleteid = deleteitem.attr("id");
                deleteurl = 'tweet/delete/';
                $("#delete-dialog").dialog("open");
            });
            $("div.item-delete a").click(function () {
                deleteitem = $(this).parent().parent();
                deleteid = $(this).attr("id");
                deleteurl = 'tweet/delete/';
                $("#delete-dialog").dialog("open");
            });
        }
    });
}

function AfterLogin() {
    $.ajax({
        type: 'POST',
        url: 'info/',
        success: function (msg) {
            $(".logined").fadeIn(300);
            $("a#name").html(msg.split(',')[0]);
            var type = msg.split(',')[1];
            if (type == 1) {
                $(".jobs").fadeIn(300);
                $(".recruitment").hide();
            }
            else {
                $(".recruitment").fadeIn(300);
                $(".jobs").hide();
            }
        }
    });
}