﻿//Init - default.js
currentsearch = 0;

function guidGenerator() {
    var S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

function ShowMiddlePic(url) {
    $("#LPic").html('<img style="margin-top:9px;margin-left:9px;" src="images/loading.gif" alt="" />');
    loagflag = false;
    var obj = new Image();
    obj.src = url;
    var $window = jQuery(window);
    var temp = ($window.width() - 50) / 2;
    var controlx = temp >= 0 ? temp : 0;
    temp = ($window.height() - 50) / 2;
    var controly = $window.scrollTop() + (temp >= 0 ? temp : 0);
    $("#LPic").css({ left: controlx + 'px', top: controly + 'px', height: '50px', width: '50px' });
    CoverResize();
    $("div#cover").fadeIn(200);
    $("#LPic").fadeIn(200);
    $("div#cover").click(function () { HidePic(); });
    $("body").keyup(function (e) {
        if (e.which == 27) {
            HidePic();
        }
    });
    $("body").css("overflow", "hidden");
    obj.onload = function () {
        temp = ($window.width() - obj.width) / 2;
        controlx = temp >= 0 ? temp : 0;
        temp = ($window.height() - obj.height) / 2;
        controly = $window.scrollTop() + (temp >= 0 ? temp : 0);
        $("#LPic").css({ left: controlx + 'px', top: controly + 'px', height: obj.height + 'px', width: obj.width + 'px' });
        if (!loagflag) {
            $("#LPic").html('<a target="_blank" href="' + url.replace("bmiddle", "large") + '"><img src="' + url + '" alt="" /></a>');
        }
    }
}


var loagflag = false;

function HidePic() {
    loagflag = true;
    $("div#cover").unbind("click");
    $("body").unbind("keyup");
    $("body").css("overflow", "auto");
    $("div#cover").fadeOut(200);
    $("#LPic").fadeOut(200);
    $("#LPic").html("");
}

$(function () {
    //    $("#LPic").draggable();
    $("#history-pic").animate({ opacity: 0.6 }, 0);

    SetHot();

    SetSorts();
    InitBoxes();
    $.ajax({
        type: 'GET',
        url: 'count/show',
        success: function (msg) {
            $("div#radio").html("本周新增职位" + $.trim(msg).split(',')[0] + "个，今日新增职位" + $.trim(msg).split(',')[1] + "个");
        }
    });

    $("#search-text").keypress(function (e) {
        if (e.which == 13) {
            if ($("#search-text").val() != "职位关键字，如：北京 产品经理 阿里巴巴" && $("#search-text").val() != "") {
                SearchContent(false, $("#search-text").val(), $("#sort").attr("name"), 0);
            }
        }
    });
    $("#search-text").keydown(function () {
        if ($(this).val().length > 32) {
            $(this).val($(this).val().substring(0, 32));
        }
        //if ($(this).val().indexOf("#") > -1 || $(this).val().indexOf("&") > -1 || $(this).val().indexOf("?") > -1) {
        //    $(this).val($(this).val().replace("#", "").replace("&", "").replace("?", ""));
        //}
    });
    $("#search-text").keyup(function () {
        if ($(this).val().length > 32) {
            $(this).val($(this).val().substring(0, 32));
        }
        //if ($(this).val().indexOf("#") > -1 || $(this).val().indexOf("&") > -1 || $(this).val().indexOf("?") > -1) {
        //    $(this).val($(this).val().replace("#", "").replace("&", "").replace("?", ""));
        //}
    });
    $("a#search-button").click(function () {
        if ($("#search-text").val() != "职位关键字，如：北京 产品经理 阿里巴巴" && $("#search-text").val() != "") {
            SearchContent(false, $("#search-text").val(), $("#sort").attr("name"), 0);
        }
    });

    $("div#backTop").click(function () {
        $("html, body").animate({ scrollTop: 0 }, 1000);
    });
    $("div#backTop").animate({ opacity: 0.6 }, 0);
    $("div#backTop").mouseover(function () {
        $("div#backTop").stop().animate({ opacity: 1 }, 200);
    });
    $("div#backTop").mouseout(function () {
        $("div#backTop").stop().animate({ opacity: 0.6 }, 200);
    });

    setTimeout(function () { GetNewerBlogs(); }, 60000);

    SetRolePicker();

    if ($.cookie("athere") == null) {
        $.cookie("athere", "here", { path: '/' });
        setTimeout(function () {
            $("#radio").slideUp(200);
        }, 30000);
    }
    else {
        $("#radio").hide();
    }

    $("a.btn_goresume").click(function () {
        document.location = "manager?type=profile";
    });


    if($.query.get("errormsg") != ""){
    	showError(decodeURI($.query.get("errormsg")));
    }
    if ($.query.get("search") != "") {
        var text = $.trim($.query.get("search"));
        var cate = $.trim($.query.get("cat"));

        if (text != "职位关键字，如：北京 产品经理 阿里巴巴" && text != "") {
            SearchContent(false, text, cate, 0);
        }
    }
    else {

        SearchContent(true, "all", 0, 0);
    }


    var $window = jQuery(window);
    var temp = ($window.scrollLeft() + $window.width() - 962) / 2;
    var controlx = 944 + (temp >= 0 ? temp : 0);
    var controly = $window.scrollTop() + $window.height() - 100;
    $("div#backTop").css({ left: controlx + 'px', top: controly + 'px' });
    $("div#backTop").css("position", "fixed");
    //    if (!($.browser.msie && $.browser.version == "6.0")) {
    //        $("div#backTop").position({
    //            of: $("div#microblogs"),
    //            my: "left top",
    //            at: "right top",
    //            offset: "0 " + ($(window).scrollTop() + $(window).height() - $("div#microblogs").offset().top - 100),
    //            collision: "none none"
    //        });
    //        $("div#backTop").css("position", "absolute");
    //    }
    $(window).resize(function () {
        var $window = jQuery(window);
        var temp = ($window.scrollLeft() + $window.width() - 962) / 2;
        var controlx = 944 + (temp >= 0 ? temp : 0);
        var controly = $window.height() - 100;
        $("div#backTop").css({ left: controlx + 'px', top: controly + 'px' });
    });
});
//End of Init

function CloseMTips() {
    $("#manager-tips").fadeOut(200);
}
function CloseCTips() {
    $("#concern-tips").fadeOut(200);
}
function CloseATips() {
    $("#apply-tips").fadeOut(200);
}

//After User Login - default.js
function AfterLogin() {
    $.ajax({
        type: 'POST',
        url: '/user/info/',
        success: function (msg) {
            msg = $.trim(msg);
            var username = msg.split(',')[0];
            var type = msg.split(',')[1];
            $("#name").html(username);
            $("#my-microbloging").attr("href", "http://weibo.com/n/" + encodeURIComponent(username));
            $("#name").attr("href", "profile/" + encodeURIComponent(username));
            if (type == -1) {
                CoverResize();
                $("div#cover").show();
                $("div#role-choose").show();
            }
            else if (type == 1) {
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
    RefreshConcern();
    RefreshHistory();
}
//End of After User Login

//Concern Event - default.js
function ConcernMouseOver(item) {
    $(item).addClass("concern-item-over");
}
function ConcernMouseOut(item) {
    $(item).removeClass("concern-item-over");
}
function ConcernDeleteClick(id, content, item) {
    $.ajax({
        type: 'GET',
        url: 'follow/delete/' + id,
        success: function (msg) {
            $(item).parent().hide();
            if (searchContent == content) {
                concernFlag = false;
                $("#search-result-concern").attr("class", "right search-result-concern");
            }
        }
    });
}
function ConcernContentClick(cate, content) {
    SetCate(cate);
    SearchContent(false, content, cate, 0);
}
function RefreshConcern() {
    $("#concern").html('<img src="images/loading.gif" style="margin-left:134px;margin-top:' + (($("#concern").height() - 32) / 2) + 'px;margin-bottom:' + (($("#concern").height() - 32) / 2) + 'px;" />');
    $.ajax({
        type: 'GET',
        url: 'follow/show',
        success: function (msg) {
            if (msg == null || msg == "") {
                $("#concern").html("尚未有关注项？试试搜索，有新发现哟！");
                $("#concern").css("color", "#878787");
                $("#concern").css("text-align", "center");
            } else {
                $("#concern").html(msg);
            }

        }
    });
}
//End of Concern Event

function SetCate(cate) {
    switch (cate) {
        case 0:
            $("#sort").html("全部分类▼");
            $("#sorts-name").html("全部分类");
            $("a#sort").attr("title", "全部分类");
            break;
        case 1:
            $("#sort").html("互联网▼");
            $("#sorts-name").html("互联网");
            break;
        case 2:
            $("#sort").html("移动互联网▼");
            $("#sorts-name").html("移动互联网");
            break;
        case 3:
            $("#sort").html("网络游戏▼");
            $("#sorts-name").html("网络游戏");
            break;
        case 4:
            $("#sort").html("电子商务▼");
            $("#sorts-name").html("电子商务");
            break;
        case 5:
            $("#sort").html("软件·电信▼");
            $("#sorts-name").html("软件·电信");
            break;
        case 6:
            $("#sort").html("新媒体▼");
            $("#sorts-name").html("新媒体");
            break;
        case 7:
            $("#sort").html("投资·银行▼");
            $("#sorts-name").html("投资·银行");
            break;
        case 8:
            $("#sort").html("其他▼");
            $("#sorts-name").html("其他");
            break;
    }
}

//History Event - default.js
function HistoryMouseOver(item) {
    $(item).addClass("history-item-over");
}
function HistoryMouseOut(item) {
    $(item).removeClass("history-item-over");
}
function HistoryPicMouseOver(item) {
    $(item).animate({ opacity: 1 }, 0);
}
function HistoryPicMouseOut(item) {
    $(item).animate({ opacity: 0.6 }, 0);
}
function HistoryPicClick() {
    $.ajax({
        type: 'GET',
        url: 'history/deleteall',
        success: function (msg) {
            $("#history").html("");
        }
    });
}
function HistoryClick(cate, content) {
    SetCate(cate);
    SearchContent(false, content, cate, 0);
}
function RefreshHistory() {
    $("#history").html('<img src="images/loading.gif" style="margin-left:134px;margin-top:' + (($("#history").height() - 32) / 2) + 'px;margin-bottom:' + (($("#history").height() - 32) / 2) + 'px;" />');
    $.ajax({
        type: 'GET',
        url: 'history/show/5',
        success: function (msg) {
            $("#history").html(msg);
        }
    });
}
//End of History Event

//Hot Event - default.js
function SetHot() {
    $.ajax({
        type: 'GET',
        url: 'hot/tag',
        success: function (msg) {
            $("#hot").html(msg);
        }
    });
}
function HotClick(content) {
    SetCate(0);
    SearchContent(false, content, 0, 0);
}
//End of Hot Event

//Search Event - default.js
var concernFlag = true;
var searchContent = "";
var cateContent = 0;
var page = 0;

function SearchConcernMouseOver(item) {
    if (!concernFlag) {
        $(item).attr("class", "right search-result-concern-over");
    }
}
function SearchConcernMouseOut(item) {
    if (!concernFlag) {
        $(item).attr("class", "right search-result-concern");
    }
}
function SearchConcernMouseDown(item) {
    if (!concernFlag) {
        $(item).attr("class", "right search-result-concern-click");
    }
}
function SearchConcernClick() {
    if (!concernFlag) {
        $.ajax({
            type: 'POST',
            url: 'follow/add/' + cateContent,
            data: { search: encodeURIComponent(searchContent) },
            success: function (msg) {
                $("#search-result-concern").attr("class", "right search-result-concern-have");
                concernFlag = true;
                RefreshConcern();
            }
        });
    }
}
function SearchContent(noresult, content, cate, pagenum, callback) {
    $("div#pages").hide();
    var thissearch;
    thissearch = guidGenerator();
    currentsearch = thissearch;
    if (!noresult && pagenum == 0) {
        content = $.trim(content);
        content = $('<div/>').text(content).html();
        var result = "";
        for (s in content.split(' ')) {
            if (content.split(' ')[s] != "") {
                result += '#<a class="keyword">' + content.split(' ')[s] + '</a>#';
            }
        }
        $("div#search-result div.left").html("正在搜索" + result + "...");
        $("#search-result-outer").show();
    }
    if (pagenum == 0) {
        firstTime = true;
    }
    else {
        firstTime = false;
    }
    $(window).unbind("scroll");
    $("#fresh-blogs").hide();
    $("#blogs").html('<img src="images/loading.gif" style="margin-left:275px;margin-top:100px;margin-bottom:100px;" />');
    $.ajax({
        type: 'POST',
        url: 'search/show/' + cate,
        data: { search: encodeURIComponent(content), page: pagenum },
        success: function (msg) {
            if (currentsearch != thissearch) return;
            var c;
            var f;
            if (pagenum == 0) {
                tt = msg.split(',');
                c = tt[0];
                countpage = Math.floor(c);
                f = tt[1];
                var str = "";
                for (s in tt) {
                    if (s == 2) {
                        str += tt[s];
                    }
                    else if (s >= 2) {
                        str += ',' + tt[s];
                    }
                }
                msg = str;
            }
            searchContent = content;
            cateContent = cate;
            $("#blogs").html(msg);
            if (pagenum == 0) {
                nowFirst = $(".microblog-item:first").attr("id");
            }
            if (callback != null) { callback(); }
            RefreshHistory();
            page = pagenum / 5;

            $("html, body").scrollTop(0);
            prevLess = false;
            nextLess = false;
            var allPage;
            if (countpage % 50 == 0) {
                allPage = Math.floor(countpage / 50);
            }
            else {
                allPage = Math.floor(countpage / 50) + 1;
            }
            if (allPage > 1) {
                var str = '<div id="pages-inner" class="right">';
                if (page != 0) {
                    str += '<a class="page-control left" id="prevPage" onclick="SearchContent(' + noresult + ',\'' + content + '\',' + cate + ',' + (pagenum - 5) + ')">上一页</a>';
                }
                for (i = 0; i < allPage; i++) {
                    if (!prevLess && i - page < -2) {
                        if (i == 0) {
                            str += '<a class="page-number left" onclick="SearchContent(' + noresult + ',\'' + content + '\',' + cate + ',' + (i * 5) + ')">' + (i + 1) + '</a>';
                        }
                        else {
                            prevLess = true;
                            str += '<span class="left">...</span>';
                        }
                    }
                    if (Math.abs(i - page) <= 2) {
                        if (i == page) {
                            str += '<a class="page-number page-number-current left" onclick="SearchContent(' + noresult + ',\'' + content + '\',' + cate + ',' + (i * 5) + ')">' + (i + 1) + '</a>';
                        }
                        else {
                            str += '<a class="page-number left" onclick="SearchContent(' + noresult + ',\'' + content + '\',' + cate + ',' + (i * 5) + ')">' + (i + 1) + '</a>';
                        }
                    }
                    if (i == allPage - 1 && i - page > 2) {
                        str += '<a class="page-number left" onclick="SearchContent(' + noresult + ',\'' + content + '\',' + cate + ',' + (i * 5) + ')">' + (i + 1) + '</a>';
                        nextLess = true;
                    }
                    if (!nextLess && i - page > 2) {
                        nextLess = true;
                        str += '<span class="left">...</span>';
                    }
                }
                if (page != allPage - 1) {
                    str += '<a class="page-control left" id="nextPage" onclick="SearchContent(' + noresult + ',\'' + content + '\',' + cate + ',' + (pagenum + 5) + ')">下一页</a>';
                }
                str += '</div>';
                $("div#pages").html(str);
            } else {
                $("div#pages").html("");
            }
            $("div#pages").show();

            if (!noresult && pagenum == 0) {
                content = $.trim(content);
                content = $('<div/>').text(content).html();
                var result = "";
                if ($("a#sort").attr("title") != "全部分类") {
                    result = $("a#sort").attr("title") + "中：";
                }
                for (s in content.split(' ')) {
                    if (content.split(' ')[s] != "") {
                        result += '#<a class="keyword">' + content.split(' ')[s] + '</a>#';
                    }
                }
                result += "的搜索结果，共有" + countpage + "条结果";
                $("div#search-result div.left").html(result);

                if (f == '0') {
                    concernFlag = false;
                    $("#search-result-concern").attr("class", "right search-result-concern");
                }
                else {
                    concernFlag = true;
                    $("#search-result-concern").attr("class", "right search-result-concern-have");
                }
                $("#search-result-outer").show();

                $("a#search-result-rss").attr("href", 'http://www.ybole.com/search/rss/' + cate + '/' + searchContent);
            }

            //            if (!($.browser.msie && $.browser.version == "6.0")) {
            //                if ($("div#backTop").css("position") != "fixed") {
            //                    $("div#backTop").position({
            //                        of: $("div#microblogs"),
            //                        my: "left top",
            //                        at: "right top",
            //                        offset: "0 " + ($(window).scrollTop() + $(window).height() - $("div#microblogs").offset().top - 100),
            //                        collision: "none none"
            //                    });
            //                    $("div#backTop").css("position", "absolute");
            //                }
            //            }

            page = pagenum;
            count = 0;

            $(window).scroll(function () {
                DocumenScroll();
            });
        }
    });
}
//End of Search Event

//Other Event

function InitBoxes() {
    $("#popBox_apply1").position({
        of: $("html"),
        my: "center top",
        at: "center top",
        offset: "0 200",
        collision: "none none"
    });
    $("#popBox_apply1").css("position", "fixed");
    $("#popBox_apply0").position({
        of: $("html"),
        my: "center top",
        at: "center top",
        offset: "0 200",
        collision: "none none"
    });
    $("#popBox_apply0").css("position", "fixed");
}

function JobLike(item, id) {
    $.ajax({
        type: 'GET',
        url: 'like/add/' + id,
        success: function (msg) {
            $(item).hide();
            $(item).next().show();
        }
    });
}
function JobUnLike(item, id) {
    $.ajax({
        type: 'GET',
        url: 'like/delete/' + id,
        success: function (msg) {
            $(item).hide();
            $(item).prev().show();
        }
    });
}
function HotCompany(item) {
    SetCate(0);
    SearchContent(false, $(item).html(), 0, 0);
}

function HideSorts() {
    $("div#sorts").hide();
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
            $(".logined").show();
            $(".jobs").show();
            $.ajax({
                type: 'POST',
                url: 'user/set_role/1',
                success: function (msg) {
                    $("body").css("overflow", "auto");
                    SearchContent(true, "all", 0, 0, function () {
                        $("#manager-tips").position({
                            of: $("#manager-center"),
                            my: "center top",
                            at: "center bottom",
                            offset: "0 0",
                            collision: "none none"
                        });
                        $("#concern-tips").position({
                            of: $("#concern-title"),
                            my: "left center",
                            at: "right center",
                            offset: "0 0",
                            collision: "none none"
                        });
                        $("#apply-tips").position({
                            of: $(".apply:first"),
                            my: "center bottom",
                            at: "center top",
                            offset: "0 0",
                            collision: "none none"
                        });
                        $("#manager-tips").show();
                        $("#concern-tips").show();
                        $("#apply-tips").show();
                    });
                }
            });
        }
        else if (rolekind == "recruitment") {
            $(".logined").show();
            $(".recruitment").show();
            $.ajax({
                type: 'POST',
                url: 'user/set_role/2',
                success: function (msg) {
                    $("body").css("overflow", "auto");
                    $("#manager-tips").position({
                        of: $("#manager-center"),
                        my: "center top",
                        at: "center bottom",
                        offset: "0 0",
                        collision: "none none"
                    });
                    $("#concern-tips").position({
                        of: $("#concern-title"),
                        my: "left center",
                        at: "right center",
                        offset: "0 0",
                        collision: "none none"
                    });
                    $("#manager-tips").show();
                    $("#concern-tips").show();
                }
            });
        }
        $("div#cover").hide();
        $("div#role-choose").hide();
    });
}
var count = 0;
var scrollflag = false;
var countpage = 100;

function DocumenScroll() {

    //    if ($.browser.msie && $.browser.version == "6.0") {
    //        //$("div#backTop").attr("position","absolute");
    //        $("div#backTop").position({
    //            of: $("div#microblogs"),
    //            my: "left top",
    //            at: "right top",
    //            offset: "0 " + ($(window).scrollTop() + $(window).height() - $("div#microblogs").offset().top - 100),
    //            collision: "none none"
    //        });
    //    }
    //    if (!($.browser.msie && $.browser.version == "6.0")) {
    //        if ($("div#backTop").css("position") != "fixed") {
    //            $("div#backTop").position({
    //                of: $("div#microblogs"),
    //                my: "left top",
    //                at: "right top",
    //                offset: "0 " + ($(window).scrollTop() + $(window).height() - $("div#microblogs").offset().top - 100),
    //                collision: "none none"
    //            });
    //            $("div#backTop").css("position", "fixed");
    //        }
    //    }
    
    if ($(window).scrollTop() != 0) {
        $("div#backTop").fadeIn(200);
    }
    else {
        $("div#backTop").fadeOut(200);
    }

    if (($(window).scrollTop() + $(window).height()) >= $(document).height() - 200 && count < 4 && !scrollflag && countpage >= 10) {
        $(window).unbind("scroll");
        count++;
        page++;
        $("#flower").fadeIn(200);
        $("#pages").hide();
        $.ajax({
            type: 'POST',
            url: 'search/show/' + cateContent,
            data: { search: encodeURIComponent(searchContent), page: page }, //, time: '-' + $(".microblog-item:last").attr("id")
            //url: 'search/' + encodeURIComponent(SearchResult) + '/' + cate + '/-' + $(".microblog-item:last").attr("id"),
            success: function (msg) {
                if (msg == "" || msg.split('"microblog-item"').length < 11) {
                    scrollflag = true;
                }

                $("#flower").fadeOut(200);
                $("#pages").show();
                $("div#blogs").html($("div#blogs").html() + msg);


                //                if (!($.browser.msie && $.browser.version == "6.0")) {
                //                    $("div#backTop").position({
                //                        of: $("div#microblogs"),
                //                        my: "left top",
                //                        at: "right top",
                //                        offset: "0 " + ($(window).scrollTop() + $(window).height() - $("div#microblogs").offset().top - 100),
                //                        collision: "none none"
                //                    });
                //                    $("div#backTop").css("position", "fixed");
                //                }

                /*
                $("a.microblog-item-relate").unbind("click");
                $("a.microblog-item-relate").click(function () {
                var text = $(this).html();
                $.ajax({
                type: 'GET',
                url: 'search/' + encodeURIComponent(text),
                success: function (msg, thissearch) {
                page = 0;
                cate = 0;
                $("#sort").html($("a#" + cate).html());
                $("#sorts-name").html($("a#" + cate).html());
                //SetSearch(msg, text, thissearch);
                nowFirst = $(".microblog-item:first").attr("id");
                }
                });
                });
                $("a.tag").unbind("click");
                $("a.tag").click(function () {
                var text = $(this).attr("title");
                    
                StartSearch('search/' + encodeURIComponent(text),
                function (msg, thissearch) {
                page = 0;
                cate = 0;
                $("#sort").html($("a#" + cate).html());
                $("#sorts-name").html($("a#" + cate).html());
                isTurn = false;
                //SetSearch(msg, text, thissearch);
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
                if (haveResume) {
                ShowResume();
                }
                else {
                ShowNoresume();
                }
                });
                
                if (rolekind && rolekind != "jobs") {
                $("a.apply").hide();
                }
                
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
                */
                $(window).scroll(function () {
                    DocumenScroll();
                });

            }
        });
    }
}

var nowFirst;
var firstTime = true;
var isFreshed = false;
var preContent = "";

function GetNewerBlogs() {

    if (firstTime) {
        nowFirst = "";
        nowFirst = $(".microblog-item:first").attr("id");
        firstTime = false;
    }
    if (nowFirst != "") {
        preContent = searchContent;
        $.ajax({
            type: 'POST',
            url: 'search/show/' + cateContent,
            data: { search: encodeURIComponent(searchContent), time: nowFirst },
            //url: 'search/' + encodeURIComponent(SearchResult) + '/' + cate + '/' + nowFirst,
            success: function (msg) {
                if (preContent == searchContent) {
                    if (msg != "") {
                        $.ajax({
                            type: 'POST',
                            url: 'count/',
                            success: function (msg) {

                                $("div#radio").html("本周新增职位" + msg.split(',')[0] + "个，今日新增职位" + msg.split(',')[1] + "个");

                            }
                        });
                        if (!isFreshed) {
                            $("div#blogs").html($("div#fresh-blogs").html() + $("div#blogs").html());
                            $("div#fresh-blogs").hide();
                            isFreshed = true;
                            /*
                            $("a.microblog-item-relate").unbind("click");
                            $("a.microblog-item-relate").click(function () {
                            var text = $(this).html();
                            StartSearch('search/' + encodeURIComponent(text),
                            function (msg, thissearch) {
                            page = 0;
                            cate = 0;
                            $("#sort").html($("a#" + cate).html());
                            $("#sorts-name").html($("a#" + cate).html());
                            SetSearch(msg, text, thissearch);
                            nowFirst = $(".microblog-item:first").attr("id");
                            });
                            });
                            $("a.tag").unbind("click");
                            $("a.tag").click(function () {
                            var text = $(this).attr("title");
                            StartSearch('search/' + encodeURIComponent(text),
                            function (msg, thissearch) {
                            page = 0;
                            cate = 0;
                            $("#sort").html($("a#" + cate).html());
                            $("#sorts-name").html($("a#" + cate).html());
                            isTurn = false;
                            SetSearch(msg, text, thissearch);
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
                            if (haveResume) {
                            ShowResume();
                            }
                            else {
                            ShowNoresume();
                            }
                            });
                            if (rolekind != "jobs") {
                            $("a.apply").hide();
                            }
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
                            */
                        }
                        if (msg.split("id=").length - 1 <= 0)
                            return;
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
                            /*
                            $("a.microblog-item-relate").unbind("click");
                            $("a.microblog-item-relate").click(function () {
                            var text = $(this).html();
                            StartSearch('search/' + encodeURIComponent(text),
                            function (msg, thissearch) {
                            page = 0;
                            cate = 0;
                            $("#sort").html($("a#" + cate).html());
                            $("#sorts-name").html($("a#" + cate).html());
                            SetSearch(msg, text, thissearch);
                            nowFirst = $(".microblog-item:first").attr("id");
                            });
                            });
                            $("a.tag").unbind("click");
                            $("a.tag").click(function () {
                            var text = $(this).attr("title");
                            StartSearch('search/' + encodeURIComponent(text),
                            function (msg, thissearch) {
                            page = 0;
                            cate = 0;
                            $("#sort").html($("a#" + cate).html());
                            $("#sorts-name").html($("a#" + cate).html());
                            isTurn = false;
                            SetSearch(msg, text, thissearch);
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
                            if (haveResume) {
                            ShowResume();
                            }
                            else {
                            ShowNoresume();
                            }
                            });
                            if (rolekind != "jobs") {
                            $("a.apply").hide();
                            }
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
                            */
                        });
                    }
                }
            }
        });
    }
    setTimeout(function () { GetNewerBlogs(); }, 60000);
}

//End of Other Event
