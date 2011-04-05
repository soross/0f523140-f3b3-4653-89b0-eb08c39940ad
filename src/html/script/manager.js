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
function ShowFavourite(e) {
    $("div#profile").hide();
    $("div#blogs").show();
    $("div#profile-control").hide();
    $("div#ads").show();
    $.ajax({
        type: 'POST',
        url: 'like/show/' + e,
        success: function (msg) {
            $("div#pages").animate({ opacity: 0 }, 50);
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
            $.ajax({
                type: "POST",
                url: 'like/count',
                success: function (msg) {
                    msg = $.trim(msg);
                    $(document).scrollTop(0);
                    var allPage;
                    if (msg % 50 == 0) {
                        allPage = Math.floor(msg / 50);
                    }
                    else {
                        allPage = Math.floor(msg / 50) + 1;
                    }
                    if (allPage > 1) {
                        prevLess = false;
                        nextLess = false;
                        var str = '<div id="pages-inner" class="right">';
                        if (page != 0) {
                            str += '<a class="page-control left" id="prevPage">上一页</a>';
                        }
                        for (i = 0; i < allPage; i++) {
                            if (!prevLess && i - page < -2) {
                                if (i == 0) {
                                    str += '<a class="page-number left">' + (i + 1) + '</a>';
                                }
                                else {
                                    prevLess = true;
                                    str += '<span class="left">...</span>';
                                }
                            }
                            if (Math.abs(i - page) <= 2) {
                                if (i == page) {
                                    str += '<a class="page-number page-number-current left">' + (i + 1) + '</a>';
                                }
                                else {
                                    str += '<a class="page-number left">' + (i + 1) + '</a>';
                                }
                            }
                            if (i == allPage - 1 && i - page > 2) {
                                str += '<a class="page-number left">' + (i + 1) + '</a>';
                                nextLess = true;
                            }
                            if (!nextLess && i - page > 2) {
                                nextLess = true;
                                str += '<span class="left">...</span>';
                            }
                        }
                        if (page != allPage - 1) {
                            str += '<a class="page-control left" id="nextPage">下一页</a>';
                        }
                        str += '</div>';
                        $("div#pages").html(str);
                        $("div#pages").animate({ opacity: 1 }, 200);
                        $("a.page-number").click(function () {
                            page = $(this).html() - 1;
                            $.ajax({
                                type: 'GET',
                                url: 'search/' + encodeURI(SearchResult) + '/' + cate + '/page/' + (page * 5),
                                success: function (msg) {
                                    isTurn = true;
                                    SetSearch(msg, SearchResult);
                                }
                            });
                        });
                        $("a#prevPage").click(function () {
                            page--;
                            $.ajax({
                                type: 'GET',
                                url: 'search/' + encodeURI(SearchResult) + '/' + cate + '/page/' + (page * 5),
                                success: function (msg) {
                                    isTurn = true;
                                    SetSearch(msg, SearchResult);
                                }
                            });
                        });
                        $("a#nextPage").click(function () {
                            page++;
                            $.ajax({
                                type: 'GET',
                                url: 'search/' + encodeURI(SearchResult) + '/' + cate + '/page/' + (page * 5),
                                success: function (msg) {
                                    isTurn = true;
                                    SetSearch(msg, SearchResult);
                                }
                            });
                        });
                    }
                }
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