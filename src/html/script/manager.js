$(function () {
    $("div#content-middle-delete a").animate({ opacity: 0.6 }, 0);
    $("div#content-middle-delete a").mouseover(function () {
        $(this).animate({ opacity: 1 }, 200);
    });
    $("div#content-middle-delete a").mouseout(function () {
        $(this).animate({ opacity: 0.6 }, 200);
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
    $("div.item").mouseover(function () {
        $(this).addClass("item-over");
    });
    $("div.item").mouseout(function () {
        $(this).removeClass("item-over");
    });
});

function ShowProfile() {
    $("div#profile").show();
    $("div#blogs").hide();
    $("div#profile-control").show();
    $("div#ads").hide();
}

function ShowApply() {
    $("a.item-control").hide();
    $("span.item-apply").show();
    $("a.item-favourite").hide();
    $("div#profile").hide();
    $("div#blogs").show();
    $("div#profile-control").hide();
    $("div#ads").show();
}
function ShowFavourite() {
    $("a.item-control").hide();
    $("span.item-apply").hide();
    $("a.item-favourite").show();
    $("div#profile").hide();
    $("div#blogs").show();
    $("div#profile-control").hide();
    $("div#ads").show();
}
function ShowNormal() {
    $("a.item-control").show();
    $("span.item-apply").hide();
    $("a.item-favourite").hide();
    $("div#profile").hide();
    $("div#blogs").show();
    $("div#profile-control").hide();
    $("div#ads").show();
}

function AfterLogin() {
    $.ajax({
        type: 'POST',
        url: 'info/',
        success: function (msg) {
            $(".logined").show();
            $(".logouted").hide();
            $("a#name").html(msg.split(',')[0]);
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