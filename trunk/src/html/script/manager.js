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

function ShowApply() {
    $("a.item-control").hide();
    $("span.item-apply").show();
    $("a.item-favourite").hide();
}
function ShowFavourite() {
    $("a.item-control").hide();
    $("span.item-apply").hide();
    $("a.item-favourite").show();
}
function ShowNormal() {
    $("a.item-control").show();
    $("span.item-apply").hide();
    $("a.item-favourite").hide();
}