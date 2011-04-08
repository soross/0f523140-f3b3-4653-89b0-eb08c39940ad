var currentsearch = 0;
var issearch = false;
var SearchResult = "all";
var count = 0;
var page = 0;
var prevLess = false;
var nextLess = false;
var nowFirst = "";
var isFreshed = false;
var isTurn = false;
var name = "";
var item;
var id;

function guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

$(function () {
    $.ajax({
        type: 'POST',
        url: 'resume/current',
        success: function (msg) {
            $.ajax({
                type: 'POST',
                url: 'resume/show/' + msg,
                success: function (e) {
                    if (e.indexOf('<html') != -1) {
                        $("#apply-info p:first").html('歪伯乐将自动帮您生成简历页面并投递到招聘者的收件箱，您可以点击<a target="_blank" class="keyword" href="resume/show/' + msg + '">这里</a>预览简历。');
                    }
                    else {
                        $("#apply-info p:first").html('歪伯乐将自动帮您生成简历页面并投递到招聘者的收件箱，您目前还没有创建简历，您可以点击<a class="keyword" href="/manager?type=profile">这里</a>创建简历。');
                    }
                }
            })
        }
    });

    if ($.cookie("athere") == null) {
        $.cookie("athere", "here", { path: '/' });
        setTimeout(function () {
            $("#radio").slideUp(200);
        }, 30000);
    }
    else {
        $("#radio").hide();
    }

    $("a.company-name").click(function () {
        var text = $.trim($(this).html());
        StartSearch('search/' + encodeURI(text), function (msg) {
                page = 0;
                cate = 0;
                $("#sort").html($("a#" + cate).html());
                $("#sorts-name").html($("a#" + cate).html());
                isTurn = false;
                SetSearch(msg, text);
            });
    });

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

    $("#error-info").dialog({
        autoOpen: false,
        draggable: false,
        resizable: false,
        modal: true,
        buttons: {
            "确定": function () {
                $(this).dialog("close");
            }
        }
    });

    $("#apply-info").dialog({
        autoOpen: false,
        draggable: false,
        resizable: false,
        buttons: {
            "确定": function () {
                $.ajax({
                    type: "POST",
                    url: 'apply/add/' + id,
                    success: function () {
                        item.hide();
                        item.next("a.unapply").show();
                    }
                });
                $(this).dialog("close");
            },
            "取消": function () {
                $(this).dialog("close");
            }
        }
    });

    if ($.query.get("errormsg") == "") {
        if ($.query.get("search") != "") {
            var text = $.trim($.query.get("search"));
            var cat = $.trim($.query.get("cat"));
            StartSearch('search/' + encodeURI(text) + '/' + cat, function (msg) {
                    page = 0;
                    cate = cat;
                    $("#sort").html($("a#" + cate).html());
                    $("#sorts-name").html($("a#" + cate).html());
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
    }
    else {
        $("#errormsg").html(decodeURI($.query.get("errormsg")));
        $("#error-info").dialog("open");
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
                StartSearch('search/' + encodeURI(text), function (msg) {
                        page = 0;
                        cate = 0;
                        $("#sort").html($("a#" + cate).html());
                        $("#sorts-name").html($("a#" + cate).html());
                        isTurn = false;
                        SetSearch(msg, text);
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

    $("#search-text").keypress(function (e) {
        if (e.which == 13) {
            if ($("#search-text").val() != "职位关键字，如：北京 产品经理 阿里巴巴" && $("#search-text").val() != "") {
                StartSearch('search/' + encodeURI($.trim($("#search-text").val())) + '/' + cate, function (msg) {
                        isTurn = false;
                        SetSearch(msg, $("#search-text").val());
                });
            }
        }
    });
    $("#search-text").keydown(function () {
        if ($(this).val().length > 32) {
            $(this).val($(this).val().substring(0, 32));
        }
        if($(this).val().indexOf("#") > -1 || $(this).val().indexOf("&") > -1 || $(this).val().indexOf("?") > -1){
            $(this).val($(this).val().replace("#","").replace("&","").replace("?",""));
        }
    });
    $("#search-text").keyup(function () {
        if ($(this).val().length > 32) {
            $(this).val($(this).val().substring(0, 32));
        }
        if($(this).val().indexOf("#") > -1 || $(this).val().indexOf("&") > -1 || $(this).val().indexOf("?") > -1){
            $(this).val($(this).val().replace("#","").replace("&","").replace("?",""));
        }
    });
    $("a#search-button").click(function () {
        if ($("#search-text").val() != "职位关键字，如：北京 产品经理 阿里巴巴" && $("#search-text").val() != "") {
            StartSearch('search/' + encodeURI($.trim($("#search-text").val())) + '/' + cate, function (msg) {
                    isTurn = false;
                    SetSearch(msg, $("#search-text").val());
            });
        }
    });
});

function SetAllSearch(msg) {
    scrollflag = false;
    $("div#fresh-outer").animate({ opacity: 0 }, 0);
    $("div#fresh-outer").hide();
    $("div#fresh-blogs").animate({ opacity: 0 }, 0);
    $("div#fresh-blogs").hide();
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
                                $(window).unbind("scroll");
                                $(window).scroll(function () {
                                    DocumenScroll();
                                });
                                count = 0;
                            });
                            $.ajax({
                                type: "POST",
                                url: 'search/' + encodeURI(SearchResult) + '/' + cate + '/count',
                                success: function (msg) {
                                    $(window).scrollTop(0);
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
                            $("a.tag").click(function () {
                                var text = $(this).attr("title");
                                $.ajax({
                                    type: 'GET',
                                    url: 'search/' + encodeURI(text),
                                    success: function (msg) {
                                        page = 0;
                                        cate = 0;
                                        $("#sort").html($("a#" + cate).html());
                                        $("#sorts-name").html($("a#" + cate).html());
                                        isTurn = false;
                                        SetSearch(msg, text);
                                    }
                                });
                            });
                            $("a.microblog-item-relate").unbind("click");
                            $("a.microblog-item-relate").click(function () {
                                var text = $(this).html();
                                StartSearch('search/' + encodeURI(text), function (msg) {
                                        page = 0;
                                        cate = 0;
                                        $("#sort").html($("a#" + cate).html());
                                        $("#sorts-name").html($("a#" + cate).html());
                                        isTurn = false;
                                        SetSearch(msg, text);
                                });
                            });
                            $("a.tag").unbind("click");
                            $("a.tag").click(function () {
                                var text = $(this).attr("title");
                                StartSearch('search/' + encodeURI(text), function (msg) {
                                        page = 0;
                                        cate = 0;
                                        $("#sort").html($("a#" + cate).html());
                                        $("#sorts-name").html($("a#" + cate).html());
                                        isTurn = false;
                                        SetSearch(msg, text);
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
                                item = $(this);
                                id = $(this).parent().parent().parent().attr("name");
                                $("#apply-info").dialog("open");
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
    var str = $("a#sort").html() + "中：";
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
                $("a#search-result-concern").attr("class", "right search-result-concern");
                $("a#search-result-concern").click(function () {
                    $.ajax({
                        type: 'POST',
                        url: 'follow/add/' + encodeURI(SearchResult),
                        success: function () {
                            $("a#search-result-concern").attr("class", "right search-result-concern-have");
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
                                                if (msg == "") {
                                                    $("#concern").html("<div style=\"text-align:center;\">您还未添加关注</div>");
                                                }
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
                $("a#search-result-concern").attr("class", "right search-result-concern-have");
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
        offset: "48 54",
        collision: "none none"
    });
    $("a#role-recruitment").position({
        of: $("div#role-choose"),
        my: "left top",
        at: "left top",
        offset: "328 54",
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
            $(".logined").fadeIn(300);
            $(".recruitment").hide();
            $(".admin").hide();
            $.ajax({
                type: 'POST',
                url: 'role/set/1',
                success: function (msg) {
                }
            });
        }
        else if (rolekind == "recruitment") {
            $(".logined").fadeIn(300);
            $(".jobs").hide();
            $(".admin").hide();
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
                    $("a#search-result-concern").attr("class", "right search-result-concern");
                    $("a#search-result-concern").mouseover(function () {
                        $(this).attr("class", "right search-result-concern-over");
                    });
                    $("a#search-result-concern").mousedown(function () {
                        $(this).attr("class", "right search-result-concern-click");
                    });
                    $("a#search-result-concern").mouseout(function () {
                        $(this).attr("class", "right search-result-concern");
                    });
                    $("a#search-result-concern").click(function () {
                        $.ajax({
                            type: 'POST',
                            url: 'follow/add/' + encodeURI(SearchResult),
                            success: function () {
                                $("a#search-result-concern").attr("class", "right search-result-concern-have");
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
                                                    if (msg == "") {
                                                        $("#concern").html("<div style=\"text-align:center;\">您还未添加关注</div>");
                                                    }
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
        $(this).parent().animate({ opacity: 0 }, 200, function () {
            $(this).slideUp(100, null, function () {
                $.ajax({
                    type: 'POST',
                    url: 'follow/show',
                    success: function (msg) {
                        if (msg == "") {
                            $("#concern").html("<div style=\"text-align:center;\">您还未添加关注</div>");
                        }
                    }
                });
            });
        });
    });
    $(".concern-item-content").click(function () {
        var text = $(this).children(".concern-item-content-info").html();
        $(this).children(".concern-item-content-number").fadeOut(200, function () { $(this).parent().removeClass("concern-item-content-new"); });
        StartSearch('search/' + encodeURI(text), function (msg) {
                page = 0;
                cate = 0;
                $("#sort").html($("a#" + cate).html());
                $("#sorts-name").html($("a#" + cate).html());
                isTurn = false;
                SetSearch(msg, text);
        });
    });
}

var countpage = 100;

function StartSearch(url, func) {
    $("div#fresh-outer").animate({ opacity: 0 }, 0);
    $("div#fresh-outer").hide();
    $("div#fresh-blogs").animate({ opacity: 0 }, 0);
    $("div#fresh-blogs").hide();
    
    $("div#pages").fadeOut(50);
    $("div#blogs").animate({ opacity: 0 }, 200, null, function () {
        $("div#blogs").slideUp(100, null, function () {
            $("div#blogs").html('<img src="images/loading.gif" style="margin-left:280px;" />');
        });
    });
     $.ajax({
                type: "GET",
                url: url,
                success: func
            }
    );
}

function SetSearch(msg, e) {
    scrollflag = false;
    SearchResult = e;
            $("div#blogs").slideDown(100, null, function () {
                $("div#blogs").animate({ opacity: 1 }, 200, null, function () {
                    $("div#blogs").animate({ opacity: 0 }, 200, null, function () {
                        $("div#blogs").slideUp(100, null, function () {
                            $("div#blogs").html(msg);
                            $("div#blogs").slideDown(100, null, function () {
                                $("div#blogs").animate({ opacity: 1 }, 200);
                                $(window).unbind("scroll");
                                $(window).scroll(function () {
                                    DocumenScroll();
                                });
                                count = 0;
                            });
                            $.ajax({
                                type: "POST",
                                url: 'search/' + encodeURI(SearchResult) + '/' + cate + '/count',
                                success: function (msg) {
                                    $(window).scrollTop(0);
                                    $("div#search-result div.left").html($("div#search-result div.left").html() + "，共有" + msg + "条结果");
                                    var allPage;
                                    if (msg % 50 == 0) {
                                        allPage = Math.floor(msg / 50);
                                    }
                                    else {
                                        allPage = Math.floor(msg / 50) + 1;
                                    }
                                    countpage = Math.floor(msg);
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
                                            StartSearch('search/' + encodeURI(SearchResult) + '/' + cate + '/page/' + (page * 5),
                                                function (msg) {
                                                    isTurn = true;
                                                    SetSearch(msg, SearchResult);
                                            });
                                        });
                                        $("a#prevPage").click(function () {
                                            page--;
                                            StartSearch('search/' + encodeURI(SearchResult) + '/' + cate + '/page/' + (page * 5),
                                                function (msg) {
                                                    isTurn = true;
                                                    SetSearch(msg, SearchResult);
                                            });
                                        });
                                        $("a#nextPage").click(function () {
                                            page++;
                                            StartSearch('search/' + encodeURI(SearchResult) + '/' + cate + '/page/' + (page * 5),
                                                function (msg) {
                                                    isTurn = true;
                                                    SetSearch(msg, SearchResult);
                                            });
                                        });
                                    }
                                }
                            });
                            if (!isTurn) {
                                nowFirst = $(".microblog-item:first").attr("id");
                            }
                            $("a.tag").click(function () {
                                var text = $(this).attr("title");
                                StartSearch('search/' + encodeURI(text),
                                    function (msg) {
                                        page = 0;
                                        cate = 0;
                                        $("#sort").html($("a#" + cate).html());
                                        $("#sorts-name").html($("a#" + cate).html());
                                        isTurn = false;
                                        SetSearch(msg, text);
                                });
                            });
                            $("a.microblog-item-relate").unbind("click");
                            $("a.microblog-item-relate").click(function () {
                                var text = $(this).html();
                                StartSearch('search/' + encodeURI(text),
                                    function (msg) {
                                        page = 0;
                                        cate = 0;
                                        $("#sort").html($("a#" + cate).html());
                                        $("#sorts-name").html($("a#" + cate).html());
                                        isTurn = false;
                                        SetSearch(msg, text);
                                });
                            });
                            $("a.tag").unbind("click");
                            $("a.tag").click(function () {
                                var text = $(this).attr("title");
                                StartSearch('search/' + encodeURI(text),
                                    function (msg) {
                                        page = 0;
                                        cate = 0;
                                        $("#sort").html($("a#" + cate).html());
                                        $("#sorts-name").html($("a#" + cate).html());
                                        isTurn = false;
                                        SetSearch(msg, text);
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
                                    item = $(this);
                                    id = $(this).parent().parent().parent().attr("name");
                                    $("#apply-info").dialog("open");
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
    $("div#search-result-outer").slideDown(200);
    if (logined) {
        $("a#search-result-concern").mouseover(function () {
            $(this).attr("class", "right search-result-concern-over");
        });
        $("a#search-result-concern").mousedown(function () {
            $(this).attr("class", "right search-result-concern-click");
        });
        $("a#search-result-concern").mouseout(function () {
            $(this).attr("class", "right search-result-concern");
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
        var text = $(this).attr("title");
        StartSearch('search/' + encodeURI(text),
            function (msg) {
                cate = 0;
                page = 0;
                $("#sort").html($("a#" + cate).html());
                $("#sorts-name").html($("a#" + cate).html());
                isTurn = false;
                SetSearch(msg, text);
        });
    });
}

var scrollflag = false;

function DocumenScroll() {
    if ($(window).scrollTop() != 0) {
        $("div#backTop").fadeIn(200)
    }
    else {
        $("div#backTop").fadeOut(200);
    }
    if (($(window).scrollTop() + $(window).height()) >= $(document).height() - 200 && count < 4 && !scrollflag && countpage >= 10) {
        $(window).unbind("scroll");
        count++;
        $("#flower").fadeIn(200);
        $.ajax({
            type: 'GET',
            url: 'search/' + encodeURI(SearchResult) + '/' + cate + '/-' + $(".microblog-item:last").attr("id"),
            success: function (msg) {
                if (msg == "" || msg.split('"microblog-item"').length < 11) {
                    scrollflag = true;
                }
                $("#flower").fadeOut(200);
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
                            $("#sort").html($("a#" + cate).html());
                            $("#sorts-name").html($("a#" + cate).html());
                            SetSearch(msg, text);
                            nowFirst = $(".microblog-item:first").attr("id");
                        }
                    });
                });
                $("a.tag").unbind("click");
                $("a.tag").click(function () {
                    var text = $(this).attr("title");
                    StartSearch('search/' + encodeURI(text),
                        function (msg) {
                            page = 0;
                            cate = 0;
                            $("#sort").html($("a#" + cate).html());
                            $("#sorts-name").html($("a#" + cate).html());
                            isTurn = false;
                            SetSearch(msg, text);
                    });
                });
                $("a.like").unbind("click");
                $("a.unlike").unbind("click");
                $("a.apply").unbind("click");
                $("a.unapply").unbind("click");
                $("a.like").click(function () {
                    var item = $(this);
                    var id = $(this).parent().parent().parent().attr("name");
                    StartSearch('like/add/' + id,
                        function () {
                            item.hide();
                            item.next("a.unlike").show();
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
                    item = $(this);
                    id = $(this).parent().parent().parent().attr("name");
                    $("#apply-info").dialog("open");
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
                $(window).scroll(function () {
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
                        StartSearch('search/' + encodeURI(text),
                            function (msg) {
                                page = 0;
                                cate = 0;
                                $("#sort").html($("a#" + cate).html());
                                $("#sorts-name").html($("a#" + cate).html());
                                SetSearch(msg, text);
                                nowFirst = $(".microblog-item:first").attr("id");
                        });
                    });
                    $("a.tag").unbind("click");
                    $("a.tag").click(function () {
                        var text = $(this).attr("title");
                        StartSearch('search/' + encodeURI(text),
                            function (msg) {
                                page = 0;
                                cate = 0;
                                $("#sort").html($("a#" + cate).html());
                                $("#sorts-name").html($("a#" + cate).html());
                                isTurn = false;
                                SetSearch(msg, text);
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
                        item = $(this);
                        id = $(this).parent().parent().parent().attr("name");
                        $("#apply-info").dialog("open");
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
                        StartSearch('search/' + encodeURI(text),
                            function (msg) {
                                page = 0;
                                cate = 0;
                                $("#sort").html($("a#" + cate).html());
                                $("#sorts-name").html($("a#" + cate).html());
                                SetSearch(msg, text);
                                nowFirst = $(".microblog-item:first").attr("id");
                        });
                    });
                    $("a.tag").unbind("click");
                    $("a.tag").click(function () {
                        var text = $(this).attr("title");
                        StartSearch('search/' + encodeURI(text),
                            function (msg) {
                                page = 0;
                                cate = 0;
                                $("#sort").html($("a#" + cate).html());
                                $("#sorts-name").html($("a#" + cate).html());
                                isTurn = false;
                                SetSearch(msg, text);
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
                        item = $(this);
                        id = $(this).parent().parent().parent().attr("name");
                        $("#apply-info").dialog("open");
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
            $("a#name").html(msg.split(',')[0]);
            name = msg.split(',')[0];
            $("div#links a:last").attr("href", "profile/" + msg.split(',')[0]);
            var type = msg.split(',')[1];
            if (type == -1) {
                $("div#cover").fadeIn(200);
                $("div#role-choose").fadeIn(200);
            }
            else if (type == 1) {
                $(".logined").fadeIn(300);
                $(".recruitment").hide();
                $(".admin").hide();
            }
            else if (type == 2) {
                $(".logined").fadeIn(300);
                $(".jobs").hide();
                $(".admin").hide();
            }
            else if (type == 0) {
                $(".logined").fadeIn(300);
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
                            if (msg == "") {
                                $("#concern").html("<div style=\"text-align:center;\">您还未添加关注</div>");
                            }
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
