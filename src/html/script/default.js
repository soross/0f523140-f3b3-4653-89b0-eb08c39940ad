var issearch = false;
var SearchResult = "all";
var count = 0;
var page = 0;
var prevLess = false;
var nextLess = false;
var nowFirst = "";
var isFreshed = false;
var isTurn = false;

$(function () {
    $("#concern-pic").animate({ opacity: 0.6 }, 0);
    $("#concern-pic").mouseover(function () {
        $(this).animate({ opacity: 1 }, 200);
    });
    $("#concern-pic").mouseout(function () {
        $(this).animate({ opacity: 0.6 }, 200);
    });
    $("#history-pic").animate({ opacity: 0.6 }, 0);
    $("#history-pic").mouseover(function () {
        $(this).stop().animate({ opacity: 1 }, 200);
    });
    $("#history-pic").mouseout(function () {
        $(this).stop().animate({ opacity: 0.6 }, 200);
    });
    $("a#history-pic").click(function () {
        $.ajax({
            type: 'POST',
            url: 'history/deleteall',
            success: function (msg) {
                $.ajax({
                    type: 'GET',
                    url: 'history/show/5',
                    success: function (msg) {
                        $(".history-item").animate({ opacity: 0 }, 200, function () {
                            $(this).slideUp(100, null, function () {
                                $("#history").html(msg);
                                SetHistory();
                            });
                        });
                    }
                });
            }
        });
    });
    SetRolePicker();
    GetNewerCount();
    if ($.query.get("search") != "") {
        var text = $.trim($.query.get("search"));
        $.ajax({
            type: 'GET',
            url: 'search/' + encodeURI(text),
            success: function (msg) {
                page = 0;
                cate = 0;
                isTurn = false;
                SetSearch(msg, text);
                setTimeout(function () { GetNewerBlogs(); }, 60000);
                $("div#backTop").position({
                    of: $("div#microblogs"),
                    my: "left top",
                    at: "right top",
                    offset: "0 " + ($(window).scrollTop() + $(window).height() - $("div#microblogs").offset().top - 100),
                    collision: "none none"
                });
                $("div#backTop").css("position", "fixed");
            }
        });
    }
    else {
        $.ajax({
            type: 'GET',
            url: 'search/all/0',
            success: function (msg) {
                isTurn = false;
                SetAllSearch(msg);
                $("div#backTop").position({
                    of: $("div#microblogs"),
                    my: "left top",
                    at: "right top",
                    offset: "0 " + ($(window).scrollTop() + $(window).height() - $("div#microblogs").offset().top - 100),
                    collision: "none none"
                });
                $("div#backTop").css("position", "fixed");
                setTimeout(function () { GetNewerBlogs(); }, 60000);
            }
        });
    }

    $.ajax({
        type: 'POST',
        url: 'hot/',
        success: function (msg) {
            $("div#hot").html(msg);
            $("a.hot-content-item").click(function () {
                var text = $(this).html().split('(')[0];
                $.ajax({
                    type: 'GET',
                    url: 'search/' + encodeURI(text),
                    success: function (msg) {
                        page = 0;
                        cate = 0;
                        isTurn = false;
                        SetSearch(msg, text);
                    }
                });
            });
        }
    });
    $("div#backTop a").click(function () {
        $("html, body").animate({ scrollTop: 0 }, 1000);
    });
    $("div#backTop").animate({ opacity: 0.6 }, 0);
    $("div#backTop").mouseover(function () {
        $("div#backTop").stop().animate({ opacity: 1 }, 200);
    });
    $("div#backTop").mouseout(function () {
        $("div#backTop").stop().animate({ opacity: 0.6 }, 200);
    });

    $(document).scroll(function () {
        DocumenScroll();
    });

    $("#search-text").keypress(function (e) {
        if (e.which == 13) {
            if ($("#search-text").val() != "职位关键字，如：北京 产品经理 阿里巴巴") {
                $.ajax({
                    type: 'GET',
                    url: 'search/' + encodeURI($.trim($("#search-text").val())) + '/' + cate,
                    success: function (msg) {
                        isTurn = false;
                        SetSearch(msg, $("#search-text").val());
                    }
                });
            }
        }
    });
    $("a#search-button").click(function () {
        if ($("#search-text").val() != "职位关键字，如：北京 产品经理 阿里巴巴") {
            $.ajax({
                type: 'GET',
                url: 'search/' + encodeURI($.trim($("#search-text").val())) + '/' + cate,
                success: function (msg) {
                    isTurn = false;
                    SetSearch(msg, $("#search-text").val());
                }
            });
        }
    });
});

function SetAllSearch(msg) {
    $("div#fresh-outer").animate({ opacity: 0 }, 0);
    $("div#fresh-outer").hide();
    $("div#fresh-blogs").animate({ opacity: 0 }, 0);
    $("div#fresh-blogs").hide();
    count = 0;
    $("div#pages").fadeOut(50);
    $("div#blogs").animate({ opacity: 0 }, 200, null, function () {
        $("div#blogs").slideUp(100, null, function () {
            $("div#blogs").html('<img src="images/loading.gif" style="margin-left:280px;" />');
            $("div#blogs").slideDown(100, null, function () {
                $("div#blogs").animate({ opacity: 1 }, 200, null, function () {
                    $("div#blogs").animate({ opacity: 0 }, 200, null, function () {
                        $("div#blogs").slideUp(100, null, function () {
                            $("div#blogs").html(msg);
                            $("div#blogs").slideDown(100, null, function () {
                                $("div#blogs").animate({ opacity: 1 }, 200);
                            });
                            $.ajax({
                                type: "POST",
                                url: 'search/' + encodeURI(SearchResult) + '/' + cate + '/count',
                                success: function (msg) {
                                    $(document).scrollTop(0);
                                    prevLess = false;
                                    nextLess = false;
                                    var allPage;
                                    if (msg % 50 == 0) {
                                        allPage = Math.floor(msg / 50);
                                    }
                                    else {
                                        allPage = Math.floor(msg / 50) + 1;
                                    }
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
                                    $("div#pages").fadeIn(200);
                                    $("a.page-number").click(function () {
                                        page = $(this).html() - 1;
                                        $.ajax({
                                            type: 'GET',
                                            url: 'search/' + encodeURI(SearchResult) + '/' + cate + '/page/' + (page * 5),
                                            success: function (msg) {
                                                isTurn = true;
                                                SetAllSearch(msg);
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
                                                SetAllSearch(msg);
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
                                                SetAllSearch(msg);
                                            }
                                        });
                                    });
                                }
                            });
                            if (!isTurn) {
                                nowFirst = $(".microblog-item:first").attr("id");
                            }
                            $("a.microblog-item-relate").click(function () {
                                var text = $(this).html();
                                $.ajax({
                                    type: 'GET',
                                    url: 'search/' + encodeURI(text),
                                    success: function (msg) {
                                        page = 0;
                                        cate = 0;
                                        isTurn = false;
                                        SetSearch(msg, text);
                                    }
                                });
                            });
                            $("a.like").click(function () {
                                var item = $(this);
                                var id = $(this).parent().parent().parent().attr("name");
                                $.ajax({
                                    type: "POST",
                                    url: 'like/add/' + id,
                                    success: function () {
                                        item.hide();
                                        item.next("a.unlike").show();
                                    }
                                });
                            });
                            $("a.unlike").click(function () {
                                var item = $(this);
                                var id = $(this).parent().parent().parent().attr("name");
                                $.ajax({
                                    type: "POST",
                                    url: 'like/delete/' + id,
                                    success: function () {
                                        item.hide();
                                        item.prev("a.like").show();
                                    }
                                });
                            });
                            $("a.apply").click(function () {
                                var item = $(this);
                                var id = $(this).parent().parent().parent().attr("name");
                                $.ajax({
                                    type: "POST",
                                    url: 'apply/add/' + id,
                                    success: function () {
                                        item.hide();
                                        item.next("a.unapply").show();
                                    }
                                });
                            });
                            $("a.unapply").click(function () {
                                var item = $(this);
                                var id = $(this).parent().parent().parent().attr("name");
                                $.ajax({
                                    type: "POST",
                                    url: 'apply/delete/' + id,
                                    success: function () {
                                        item.hide();
                                        item.prev("a.apply").show();
                                    }
                                });
                            });
                        });
                    });
                });
            });
        });
    });
}

function GetNewerCount() {
    $.ajax({
        type: 'POST',
        url: 'count/',
        success: function (msg) {
            if (!issearch) {
                $("div#radio").html("本周新增职位" + $.trim(msg).split(',')[0] + "个，今日新增职位" + $.trim(msg).split(',')[1] + "个");
                setTimeout(function () { GetNewerCount(); }, 1200000);
            }
        }
    });
}

function SetResult(msg) {
    msg = $.trim(msg);
    SearchResult = msg
    var str = "";
    for (s in msg.split(' ')) {
        if (msg.split(' ')[s] != "") {
            str += '#<a class="keyword">' + msg.split(' ')[s] + '</a>#';
        }
    }
    str += "的搜索结果";
    $("div#search-result div.left").html(str);
    $.ajax({
        type: 'POST',
        url: 'follow/exist/' + encodeURI(msg),
        success: function (e) {
            if (e[0] == '0') {
                $("a#search-result-concern").attr("class", "left search-result-concern");
                $("a#search-result-concern").click(function () {
                    $.ajax({
                        type: 'POST',
                        url: 'follow/add/' + encodeURI(SearchResult),
                        success: function () {
                            $("a#search-result-concern").attr("class", "left search-result-concern-have");
                            $("a#search-result-concern").unbind("mouseover");
                            $("a#search-result-concern").unbind("mousedown");
                            $("a#search-result-concern").unbind("mouseout");
                            $("a#search-result-concern").unbind("click");
                            $("div#concern").animate({ opacity: 0 }, 200, null, function () {
                                $("div#concern").html('<img src="images/loading.gif" style="margin-left:134px;margin-top:' + (($("div#concern").height() - 32) / 2) + 'px;margin-bottom:' + (($("div#concern").height() - 32) / 2) + 'px;" />');
                                $("div#concern").animate({ opacity: 1 }, 200, null, function () {
                                    $.ajax({
                                        type: 'POST',
                                        url: 'follow/show',
                                        success: function (msg) {
                                            $("div#concern").animate({ opacity: 0 }, 200, null, function () {
                                                $("#concern").html(msg);
                                                SetConcern();
                                                $("div#concern").animate({ opacity: 1 }, 200);
                                            });
                                        }
                                    });
                                });
                            });
                        }
                    });
                });
            }
            else {
                $("a#search-result-concern").attr("class", "left search-result-concern-have");
                $("a#search-result-concern").unbind("mouseover");
                $("a#search-result-concern").unbind("mousedown");
                $("a#search-result-concern").unbind("mouseout");
            }
        }
    });
    $("a#search-result-rss").attr("href", 'rss/' + encodeURI(msg));
}

function SetRolePicker() {
    $("div#role-choose").position({
        of: $("body"),
        my: "center top",
        at: "center top",
        offset: "0 130",
        collision: "none none"
    });
    $("a#role-jobs").position({
        of: $("div#role-choose"),
        my: "left top",
        at: "left top",
        offset: "51 57",
        collision: "none none"
    });
    $("a#role-recruitment").position({
        of: $("div#role-choose"),
        my: "left top",
        at: "left top",
        offset: "331 57",
        collision: "none none"
    });
    $("a#role-confirm").position({
        of: $("div#role-choose"),
        my: "left top",
        at: "left top",
        offset: "190 276",
        collision: "none none"
    });

    $("a#role-jobs").click(function () {
        $("div#role-choose").removeClass("role-recruitment");
        $("div#role-choose").addClass("role-jobs");
        rolekind = "jobs";
    });
    $("a#role-recruitment").click(function () {
        $("div#role-choose").removeClass("role-jobs");
        $("div#role-choose").addClass("role-recruitment");
        rolekind = "recruitment";
    });
    $("a#role-confirm").click(function () {
        if (rolekind == "jobs") {
            $(".jobs").show();
            $(".recruitment").hide();
            $.ajax({
                type: 'POST',
                url: 'role/set/1',
                success: function (msg) {
                }
            });
        }
        else if (rolekind == "recruitment") {
            $(".jobs").hide();
            $(".recruitment").show();
            $.ajax({
                type: 'POST',
                url: 'role/set/2',
                success: function (msg) {
                }
            });
        }
        $("div#cover").fadeOut(200);
        $("div#role-choose").fadeOut(200);
    });
}

function SetConcern() {
    $(".concern-item").mouseover(function () {
        $(this).addClass("concern-item-over");
    });
    $(".concern-item").mouseout(function () {
        $(this).removeClass("concern-item-over");
    });
    $(".concern-item-delete").click(function () {
        var item = $(this);
        $.ajax({
            type: 'POST',
            url: 'follow/delete/' + $(this).attr("id"),
            success: function () {
                var text = item.next(".concern-item-content").children(".concern-item-content-info").html();
                if (text == SearchResult) {
                    $("a#search-result-concern").attr("class", "left search-result-concern");
                    $("a#search-result-concern").mouseover(function () {
                        $(this).attr("class", "left search-result-concern-over");
                    });
                    $("a#search-result-concern").mousedown(function () {
                        $(this).attr("class", "left search-result-concern-click");
                    });
                    $("a#search-result-concern").mouseout(function () {
                        $(this).attr("class", "left search-result-concern");
                    });
                    $("a#search-result-concern").click(function () {
                        $.ajax({
                            type: 'POST',
                            url: 'follow/add/' + encodeURI(SearchResult),
                            success: function () {
                                $("a#search-result-concern").attr("class", "left search-result-concern-have");
                                $("a#search-result-concern").unbind("mouseover");
                                $("a#search-result-concern").unbind("mousedown");
                                $("a#search-result-concern").unbind("mouseout");
                                $("a#search-result-concern").unbind("click");
                                $("div#concern").animate({ opacity: 0 }, 200, null, function () {
                                    $("div#concern").html('<img src="images/loading.gif" style="margin-left:134px;margin-top:' + (($("div#concern").height() - 32) / 2) + 'px;margin-bottom:' + (($("div#concern").height() - 32) / 2) + 'px;" />');
                                    $("div#concern").animate({ opacity: 1 }, 200, null, function () {
                                        $.ajax({
                                            type: 'POST',
                                            url: 'follow/show',
                                            success: function (msg) {
                                                $("div#concern").animate({ opacity: 0 }, 200, null, function () {
                                                    $("#concern").html(msg);
                                                    SetConcern();
                                                    $("div#concern").animate({ opacity: 1 }, 200);
                                                });
                                            }
                                        });
                                    });
                                });
                            }
                        });
                    });
                }
            }
        });
        $(this).parent().animate({ opacity: 0 }, 200, function () { $(this).slideUp(100); });
    });
    $(".concern-item-content").click(function () {
        var text = $(this).children(".concern-item-content-info").html();
        $(this).children(".concern-item-content-number").fadeOut(200, function () { $(this).parent().removeClass("concern-item-content-new"); });
        $.ajax({
            type: 'GET',
            url: 'search/' + encodeURI(text),
            success: function (msg) {
                page = 0;
                cate = 0;
                isTurn = false;
                SetSearch(msg, text);
            }
        });
    });
}

function SetSearch(msg, e) {
    $("div#fresh-outer").animate({ opacity: 0 }, 0);
    $("div#fresh-outer").hide();
    $("div#fresh-blogs").animate({ opacity: 0 }, 0);
    $("div#fresh-blogs").hide();
    count = 0;
    SearchResult = e;
    $("div#pages").fadeOut(50);
    $("div#blogs").animate({ opacity: 0 }, 200, null, function () {
        $("div#blogs").slideUp(100, null, function () {
            $("div#blogs").html('<img src="images/loading.gif" style="margin-left:280px;" />');
            $("div#blogs").slideDown(100, null, function () {
                $("div#blogs").animate({ opacity: 1 }, 200, null, function () {
                    $("div#blogs").animate({ opacity: 0 }, 200, null, function () {
                        $("div#blogs").slideUp(100, null, function () {
                            $("div#blogs").html(msg);
                            $("div#blogs").slideDown(100, null, function () {
                                $("div#blogs").animate({ opacity: 1 }, 200);
                            });
                            $.ajax({
                                type: "POST",
                                url: 'search/' + encodeURI(SearchResult) + '/' + cate + '/count',
                                success: function (msg) {
                                    $(document).scrollTop(0);
                                    $("div#search-result div.left").html($("div#search-result div.left").html() + "，共有" + msg + "条结果");
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
                                        $("div#pages").fadeIn(200);
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
                            if (!isTurn) {
                                nowFirst = $(".microblog-item:first").attr("id");
                            }
                            $("a.microblog-item-relate").click(function () {
                                var text = $(this).html();
                                $.ajax({
                                    type: 'GET',
                                    url: 'search/' + encodeURI(text),
                                    success: function (msg) {
                                        page = 0;
                                        cate = 0;
                                        isTurn = false;
                                        SetSearch(msg, text);
                                    }
                                });
                            });
                            if (logined) {
                                $("a.like").click(function () {
                                    var item = $(this);
                                    var id = $(this).parent().parent().parent().attr("name");
                                    $.ajax({
                                        type: "POST",
                                        url: 'like/add/' + id,
                                        success: function () {
                                            item.hide();
                                            item.next("a.unlike").show();
                                        }
                                    });
                                });
                                $("a.unlike").click(function () {
                                    var item = $(this);
                                    var id = $(this).parent().parent().parent().attr("name");
                                    $.ajax({
                                        type: "POST",
                                        url: 'like/delete/' + id,
                                        success: function () {
                                            item.hide();
                                            item.prev("a.like").show();
                                        }
                                    });
                                });
                                $("a.apply").click(function () {
                                    var item = $(this);
                                    var id = $(this).parent().parent().parent().attr("name");
                                    $.ajax({
                                        type: "POST",
                                        url: 'apply/add/' + id,
                                        success: function () {
                                            item.hide();
                                            item.next("a.unapply").show();
                                        }
                                    });
                                });
                                $("a.unapply").click(function () {
                                    var item = $(this);
                                    var id = $(this).parent().parent().parent().attr("name");
                                    $.ajax({
                                        type: "POST",
                                        url: 'apply/delete/' + id,
                                        success: function () {
                                            item.hide();
                                            item.prev("a.apply").show();
                                        }
                                    });
                                });
                            }
                        });
                    });
                });
            });
        });
    });
    $("div#search-result-outer").slideDown(200);
    if (logined) {
        $("a#search-result-concern").mouseover(function () {
            $(this).attr("class", "left search-result-concern-over");
        });
        $("a#search-result-concern").mousedown(function () {
            $(this).attr("class", "left search-result-concern-click");
        });
        $("a#search-result-concern").mouseout(function () {
            $(this).attr("class", "left search-result-concern");
        });
        $("div#history").animate({ opacity: 0 }, 200, null, function () {
            $("div#history").html('<img src="images/loading.gif" style="margin-left:134px;margin-top:' + (($("div#history").height() - 32) / 2) + 'px;margin-bottom:' + (($("div#history").height() - 32) / 2) + 'px;" />');
            $("div#history").animate({ opacity: 1 }, 200, null, function () {
                $.ajax({
                    type: 'GET',
                    url: 'history/show/5',
                    success: function (msg) {
                        $("div#history").animate({ opacity: 0 }, 200, null, function () {
                            $("div#history").html(msg);
                            SetHistory();
                            $("div#history").animate({ opacity: 1 }, 200);
                        });
                    }
                });
            });
        });
    }
    SetResult(e);
    if (!logined) {
        $("a#search-result-concern").hide();
    }
    else {
        $("a#search-result-concern").show();
    }
}

function GetOlderBlogs() {
}

function SetHistory() {
    $(".history-item").mouseover(function () { $(this).addClass("history-item-over"); });
    $(".history-item").mouseout(function () { $(this).removeClass("history-item-over"); });
    $(".history-item").click(function () {
        var text = $(this).children("a").html();
        $.ajax({
            type: 'GET',
            url: 'search/' + encodeURI(text),
            success: function (msg) {
                cate = 0;
                page = 0;
                isTurn = false;
                SetSearch(msg, text);
            }
        });
    });
}


function DocumenScroll() {
    if ($(window).scrollTop() != 0) {
        $("div#backTop").fadeIn(200)
    }
    else {
        $("div#backTop").fadeOut(200);
    }
    if (($(window).scrollTop() + $(window).height()) >= $(document).height() - 200 && count < 4) {
        $(document).unbind("scroll");
        count++;
        $.ajax({
            type: 'GET',
            url: 'search/' + encodeURI(SearchResult) + '/' + cate + '/-' + $(".microblog-item:last").attr("id"),
            success: function (msg) {
                $("div#blogs").html($("div#blogs").html() + msg);
                $("a.microblog-item-relate").unbind("click");
                $("a.microblog-item-relate").click(function () {
                    var text = $(this).html();
                    $.ajax({
                        type: 'GET',
                        url: 'search/' + encodeURI(text),
                        success: function (msg) {
                            page = 0;
                            cate = 0;
                            SetSearch(msg, text);
                            nowFirst = $(".microblog-item:first").attr("id");
                        }
                    });
                });
                $("a.like").unbind("click");
                $("a.unlike").unbind("click");
                $("a.apply").unbind("click");
                $("a.unapply").unbind("click");
                $("a.like").click(function () {
                    var item = $(this);
                    var id = $(this).parent().parent().parent().attr("name");
                    $.ajax({
                        type: "POST",
                        url: 'like/add/' + id,
                        success: function () {
                            item.hide();
                            item.next("a.unlike").show();
                        }
                    });
                });
                $("a.unlike").click(function () {
                    var item = $(this);
                    var id = $(this).parent().parent().parent().attr("name");
                    $.ajax({
                        type: "POST",
                        url: 'like/delete/' + id,
                        success: function () {
                            item.hide();
                            item.prev("a.like").show();
                        }
                    });
                });
                $("a.apply").click(function () {
                    var item = $(this);
                    var id = $(this).parent().parent().parent().attr("name");
                    $.ajax({
                        type: "POST",
                        url: 'apply/add/' + id,
                        success: function () {
                            item.hide();
                            item.next("a.unapply").show();
                        }
                    });
                });
                $("a.unapply").click(function () {
                    var item = $(this);
                    var id = $(this).parent().parent().parent().attr("name");
                    $.ajax({
                        type: "POST",
                        url: 'apply/delete/' + id,
                        success: function () {
                            item.hide();
                            item.prev("a.apply").show();
                        }
                    });
                });
                $(document).scroll(function () {
                    DocumenScroll();
                });
            }
        });
    }
}

function GetNewerBlogs() {
    $.ajax({
        type: 'GET',
        url: 'search/' + encodeURI(SearchResult) + '/' + cate + '/' + nowFirst,
        success: function (msg) {
            if (msg != "") {
                $.ajax({
                    type: 'POST',
                    url: 'count/',
                    success: function (msg) {
                        if (!issearch) {
                            $("div#radio").html("本周新增职位" + msg.split(',')[0] + "个，今日新增职位" + msg.split(',')[1] + "个");
                        }
                    }
                });
                if (!isFreshed) {
                    $("div#blogs").html($("div#fresh-blogs").html() + $("div#blogs").html());
                    $("div#fresh-blogs").hide();
                    isFreshed = true;
                    $("a.microblog-item-relate").unbind("click");
                    $("a.microblog-item-relate").click(function () {
                        var text = $(this).html();
                        $.ajax({
                            type: 'GET',
                            url: 'search/' + encodeURI(text),
                            success: function (msg) {
                                page = 0;
                                cate = 0;
                                SetSearch(msg, text);
                                nowFirst = $(".microblog-item:first").attr("id");
                            }
                        });
                    });
                    $("a.like").unbind("click");
                    $("a.unlike").unbind("click");
                    $("a.apply").unbind("click");
                    $("a.unapply").unbind("click");
                    $("a.like").click(function () {
                        var item = $(this);
                        var id = $(this).parent().parent().parent().attr("name");
                        $.ajax({
                            type: "POST",
                            url: 'like/add/' + id,
                            success: function () {
                                item.hide();
                                item.next("a.unlike").show();
                            }
                        });
                    });
                    $("a.unlike").click(function () {
                        var item = $(this);
                        var id = $(this).parent().parent().parent().attr("name");
                        $.ajax({
                            type: "POST",
                            url: 'like/delete/' + id,
                            success: function () {
                                item.hide();
                                item.prev("a.like").show();
                            }
                        });
                    });
                    $("a.apply").click(function () {
                        var item = $(this);
                        var id = $(this).parent().parent().parent().attr("name");
                        $.ajax({
                            type: "POST",
                            url: 'apply/add/' + id,
                            success: function () {
                                item.hide();
                                item.next("a.unapply").show();
                            }
                        });
                    });
                    $("a.unapply").click(function () {
                        var item = $(this);
                        var id = $(this).parent().parent().parent().attr("name");
                        $.ajax({
                            type: "POST",
                            url: 'apply/delete/' + id,
                            success: function () {
                                item.hide();
                                item.prev("a.apply").show();
                            }
                        });
                    });
                }
                $("div#fresh-blogs").html(msg);
                $("div#fresh").html('有' + (msg.split("id=").length - 1) + '条更新，点击查看');
                $("div#fresh-outer").slideDown(300, null, function () {
                    $("div#fresh-outer").animate({ opacity: 1 }, 200);
                });
                $("div#fresh").click(function () {
                    isFreshed = false;
                    $("div#fresh-blogs").slideDown(500, null, function () {
                        $("div#fresh-blogs").animate({ opacity: 1 }, 200);
                    });
                    nowFirst = $(".microblog-item:first").attr("id");
                    $("div#fresh-outer").animate({ opacity: 0 }, 0, null, function () {
                        $("div#fresh-outer").slideUp(300);
                    });
                    $("a.microblog-item-relate").unbind("click");
                    $("a.microblog-item-relate").click(function () {
                        var text = $(this).html();
                        $.ajax({
                            type: 'GET',
                            url: 'search/' + encodeURI(text),
                            success: function (msg) {
                                page = 0;
                                cate = 0;
                                SetSearch(msg, text);
                                nowFirst = $(".microblog-item:first").attr("id");
                            }
                        });
                    });
                    $("a.like").unbind("click");
                    $("a.unlike").unbind("click");
                    $("a.apply").unbind("click");
                    $("a.unapply").unbind("click");
                    $("a.like").click(function () {
                        var item = $(this);
                        var id = $(this).parent().parent().parent().attr("name");
                        $.ajax({
                            type: "POST",
                            url: 'like/add/' + id,
                            success: function () {
                                item.hide();
                                item.next("a.unlike").show();
                            }
                        });
                    });
                    $("a.unlike").click(function () {
                        var item = $(this);
                        var id = $(this).parent().parent().parent().attr("name");
                        $.ajax({
                            type: "POST",
                            url: 'like/delete/' + id,
                            success: function () {
                                item.hide();
                                item.prev("a.like").show();
                            }
                        });
                    });
                    $("a.apply").click(function () {
                        var item = $(this);
                        var id = $(this).parent().parent().parent().attr("name");
                        $.ajax({
                            type: "POST",
                            url: 'apply/add/' + id,
                            success: function () {
                                item.hide();
                                item.next("a.unapply").show();
                            }
                        });
                    });
                    $("a.unapply").click(function () {
                        var item = $(this);
                        var id = $(this).parent().parent().parent().attr("name");
                        $.ajax({
                            type: "POST",
                            url: 'apply/delete/' + id,
                            success: function () {
                                item.hide();
                                item.prev("a.apply").show();
                            }
                        });
                    });
                });
            }
        }
    });
    setTimeout(function () { GetNewerBlogs(); }, 60000);
}

function AfterLogin() {
    $.ajax({
        type: 'POST',
        url: 'info/',
        success: function (msg) {
            $(".logined").fadeIn(300);
            $("a#name").html(msg.split(',')[0]);
            $("div#links a:last").attr("href", "profile/" + msg.split(',')[0]);
            var type = msg.split(',')[1];
            if (type == 0) {
                $("div#cover").fadeIn(200);
                $("div#role-choose").fadeIn(200);
            }
            else if (type == 1) {
                $(".jobs").fadeIn(300);
                $(".recruitment").hide();
            }
            else {
                $(".recruitment").fadeIn(300);
                $(".jobs").hide();
            }
            $("#concern").html('<img src="images/loading.gif" style="margin-left:134px;" />');
            $.ajax({
                type: 'POST',
                url: 'follow/show',
                success: function (msg) {
                    $("#concern").animate({ opacity: 0 }, 200, null, function () {
                        $("#concern").slideUp(100, null, function () {
                            $("#concern").html(msg);
                            SetConcern();
                            $("#concern").slideDown(100, null, function () {
                                $("#concern").animate({ opacity: 1 }, 200);
                            });
                        });
                    });
                }
            });
            $("#history").html('<img src="images/loading.gif" style="margin-left:134px;" />');
            $.ajax({
                type: 'GET',
                url: 'history/show/5',
                success: function (msg) {
                    $("#history").animate({ opacity: 0 }, 200, null, function () {
                        $("#history").slideUp(100, null, function () {
                            $("#history").html(msg);
                            SetHistory();
                            $("#history").slideDown(100, null, function () {
                                $("#history").animate({ opacity: 1 }, 200);
                            });
                        });
                    });
                }
            });
        }
    });
}