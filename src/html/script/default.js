//Init - default.js
$(function () {
    $("#history-pic").animate({ opacity: 0.6 }, 0);

    SetHot();

    SearchContent(true, "all", 0, 0);

    SetSorts();

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
                SearchContent(false, $("#search-text").val(), $("#sort").attr("id"), 0);
            }
        }
    });
    $("#search-text").keydown(function () {
        if ($(this).val().length > 32) {
            $(this).val($(this).val().substring(0, 32));
        }
        if ($(this).val().indexOf("#") > -1 || $(this).val().indexOf("&") > -1 || $(this).val().indexOf("?") > -1) {
            $(this).val($(this).val().replace("#", "").replace("&", "").replace("?", ""));
        }
    });
    $("#search-text").keyup(function () {
        if ($(this).val().length > 32) {
            $(this).val($(this).val().substring(0, 32));
        }
        if ($(this).val().indexOf("#") > -1 || $(this).val().indexOf("&") > -1 || $(this).val().indexOf("?") > -1) {
            $(this).val($(this).val().replace("#", "").replace("&", "").replace("?", ""));
        }
    });
    $("a#search-button").click(function () {
        if ($("#search-text").val() != "职位关键字，如：北京 产品经理 阿里巴巴" && $("#search-text").val() != "") {
            SearchContent(false, $("#search-text").val(), $("#sort").attr("id"), 0);
        }
    });
});
//End of Init

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
            if (type == -1) {
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
    SearchContent(false, content, cate, 0);
}
function RefreshConcern() {
    $("#concern").html('<img src="images/loading.gif" style="margin-left:134px;margin-top:' + (($("#concern").height() - 32) / 2) + 'px;margin-bottom:' + (($("#concern").height() - 32) / 2) + 'px;" />');
    $.ajax({
        type: 'GET',
        url: 'follow/show',
        success: function (msg) {
            $("#concern").html(msg);
        }
    });
}
//End of Concern Event

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
            data: { search: encodeURI(searchContent) },
            success: function (msg) {
                $("#search-result-concern").attr("class", "right search-result-concern-have");
                concernFlag = true;
                RefreshConcern();
            }
        });
    }
}
function SearchContent(noresult, content, cate, pagenum) {
    $("#blogs").html('<img src="images/loading.gif" style="margin-left:275px;margin-top:' + (($("#blogs").height() - 32) / 2) + 'px;margin-bottom:' + (($("#blogs").height() - 32) / 2) + 'px;" />');
    $.ajax({
        type: 'POST',
        url: 'search/' + cate,
        data: { search: encodeURI(content), page: pagenum },
        success: function (msg) {
            searchContent = content;
            cateContent = cate;
            $("#blogs").html(msg);
            RefreshHistory();
            page = pagenum / 5;
            $.ajax({
                type: 'POST',
                url: 'search/count/' + cate,
                data: { search: encodeURI(content) },
                success: function (msg) {
                    msg = $.trim(msg);
                    $("html, body").scrollTop(0);
                    prevLess = false;
                    nextLess = false;
                    var allPage;
                    if (msg % 50 == 0) {
                        allPage = Math.floor(msg / 50);
                    }
                    else {
                        allPage = Math.floor(msg / 50) + 1;
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
                    }

                    if (!noresult) {
                        content = $.trim(content);
                        var result = "";
                        if ($("a#sort").attr("title") != "全部分类") {
                            result = $("a#sort").attr("title") + "中：";
                        }
                        for (s in content.split(' ')) {
                            if (content.split(' ')[s] != "") {
                                result += '#<a class="keyword">' + content.split(' ')[s] + '</a>#';
                            }
                        }
                        result += "的搜索结果，共有" + msg + "条结果";
                        $("div#search-result div.left").html(result);

                        $.ajax({
                            type: 'POST',
                            url: 'follow/exist/' + cateContent,
                            data: { search: encodeURI(content) },
                            success: function (e) {
                                if ($.trim(e) == '0') {
                                    concernFlag = false;
                                    $("#search-result-concern").attr("class", "right search-result-concern");
                                }
                                else {
                                    concernFlag = true;
                                    $("#search-result-concern").attr("class", "right search-result-concern-have");
                                }
                                $("#search-result-outer").show();
                            }
                        });
                    }
                }
            });
        }
    });
}
//End of Search Event

//Other Event
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
function JobApply(item, id, name) {
    var userid;
    $.ajax({
        type: 'GET',
        url: 'resume/current',
        success: function (msg) {
            userid = $.trim(msg);
            $.ajax({
                type: 'GET',
                url: 'resume/show/' + userid,
                success: function (resume) {
                    if (resume.indexOf("<html") != -1) {
                        $("#popBox_apply1").show();
                        $("#at-name").html("@" + name);
                    }
                    else {
                        $("#popBox_apply0").show();
                    }
                }
            });
        }
    });
}
function JobUnApply(item, id) {
}
function HotCompany(item) {
    SearchContent(false, $(item).html(), 0, 0);
}
function SetSorts() {
    $.ajax({
        type: 'GET',
        url: 'cate',
        success: function (msg) {
            $("#sorts-content").html(msg);
        }
    });
    $("div#sorts").position({
        of: $("a#sort"),
        my: "left top",
        at: "left top",
        offset: "-5 -10",
        collision: "none none"
    });
}
function ShowSorts() {
    $("div#sorts").show();
}
function HideSorts() {
    $("div#sorts").hide();
}
//End of Other Event