var issearch = false;
var SearchResult = "all";

$(function () {
    SetRolePicker();
    GetNewerCount();
    $.ajax({
        type: 'GET',
        url: 'search/all',
        success: function (msg) {
            $("div#blogs").html(msg);
        }
    });
});

function GetNewerCount() {
    $.ajax({
        type: 'POST',
        url: 'count/',
        success: function (msg) {
            if (!issearch) {
                $("div#radio").html("本周新增职位" + msg.split(',')[0] + "个，今日新增职位" + msg.split(',')[1] + "个");
                setTimeout(function () { GetNewerJob(); }, 1200000);
            }
        }
    });
}

function SetResult(msg) {
    SearchResult = msg;
    var str = "";
    for (s in msg.split(' ')) {
        str += '#<a class="keyword">' + msg.split(' ')[s] + '</a>#';
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
                            $.ajax({
                                type: 'POST',
                                url: 'follow/show/5',
                                success: function (msg) {
                                    $("#concern").html(msg);
                                    SetConcern();
                                }
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
                    alert(msg);
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
                    alert(msg);
                }
            });
        }
        $("div#cover").fadeOut(200);
        $("div#role-choose").fadeOut(200);
    });
}

function SetConcern() {
    $("#concern-pic").animate({ opacity: 0.6 }, 0);
    $("#concern-pic").mouseover(function () {
        $(this).animate({ opacity: 1 }, 200);
    });
    $("#concern-pic").mouseout(function () {
        $(this).animate({ opacity: 0.6 }, 200);
    });
    $(".concern-item").mouseover(function () {
        $(this).addClass("concern-item-over");
    });
    $(".concern-item").mouseout(function () {
        $(this).removeClass("concern-item-over");
    });
    $(".concern-item-delete").click(function () {
        $.ajax({
            type: 'POST',
            url: 'follow/delete/' + $(this).attr("id"),
            success: function () {
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
                SetSearch(msg, text);
            }
        });
    });
}

function SetSearch(msg, e) {
    SearchResult = e;
    $("div#blogs").html(msg);
    $("div#search-result-outer").slideDown(200);
    $("a#search-result-concern").mouseover(function () {
        $(this).attr("class", "left search-result-concern-over");
    });
    $("a#search-result-concern").mousedown(function () {
        $(this).attr("class", "left search-result-concern-click");
    });
    $("a#search-result-concern").mouseout(function () {
        $(this).attr("class", "left search-result-concern");
    });
    $.ajax({
        type: 'GET',
        url: 'history/show/5',
        success: function (msg) {
            $("div#history").html(msg);
            SetHistory();
        }
    });
    SetResult(e);
}

//function GetNewerBlogs() {
//    $.ajax({
//        type: "GET",
//        url: 'search/' + encodeURI(SearchResult) + '/' + cate + '/' + $(".microblog-item:first").attr("id"),
//        success: function (msg) { 
//        }
//    });
//}

function GetOlderBlogs() { 
}

function SetHistory() {
    $("#history-pic").animate({ opacity: 0.6 }, 0);
    $("#history-pic").mouseover(function () {
        $(this).stop().animate({ opacity: 1 }, 200);
    });
    $("#history-pic").mouseout(function () {
        $(this).stop().animate({ opacity: 0.6 }, 200);
    });
    $(".history-item").mouseover(function () { $(this).addClass("history-item-over"); });
    $(".history-item").mouseout(function () { $(this).removeClass("history-item-over"); });
    $(".history-item").click(function () {
        var text = $(this).children("a").html();
        $.ajax({
            type: 'GET',
            url: 'search/' + encodeURI(text),
            success: function (msg) {
                SetSearch(msg, text);
            }
        });
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
}