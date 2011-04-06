var deleteitem;
var deleteid;
var deleteurl;
var page = 0;
var allpage = 0;
var type = "";

$(function () {
    ShowNormal(0);
    $("a.manager-control").click(function () {
        $("a.manager-control").removeClass("manager-control-choose");
        $(this).addClass("manager-control-choose");
    });
    $(".logined").show();


    $("#delete-dialog").dialog({
        autoOpen: false,
        draggable: false,
        resizable: false,
        width: 180,
        buttons: {
            "确定": function () {
                $(this).dialog("close");
                var flag = false;
                $("div#pages").fadeOut(50);
                if (allpage > 1) {
                    flag = true;
                }
                $.ajax({
                    type: "POST",
                    url: deleteurl + deleteid,
                    success: function () {
                        deleteitem.animate({ opacity: 0 }, 300, null, function () {
                            deleteitem.slideUp(200, null, function () {
                                if (type == "feedback") {
                                    if (flag) {
                                        $.ajax({
                                            type: 'POST',
                                            url: 'feedback/show/' + page,
                                            success: function (msg) {
                                                var str = '<div class="item newer" style="display:none;"';
                                                str += msg.split('<div class="item"')[10];
                                                $("div.item:last").after(str);
                                                $(".newer:last").slideDown(200);
                                                $("a.delete").unbind("click");
                                                $(".item-blog-title").unbind("click");
                                                $("a.delete").click(function () {
                                                    deleteitem = $(this).parent().parent().parent();
                                                    deleteid = deleteitem.attr("id");
                                                    deleteurl = 'feedback/delete/';
                                                    type = "feedback";
                                                    $("#delete-dialog").dialog("open");
                                                });
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
                                            }
                                        });
                                    }
                                    UpdateFeedback();
                                }
                                else if (type == "tweet") {
                                    if (flag) {
                                        $.ajax({
                                            type: 'POST',
                                            url: 'search/poiuy/0/page/' + page,
                                            success: function (msg) {
                                                var str = '<div class="microblog-item newer" style="display:none;"';
                                                str += msg.split('<div class="microblog-item"')[10];
                                                $("div.microblog-item:last").after(str);
                                                $(".newer:last").slideDown(200);
                                                $("a.delete").unbind("click");
                                                $("a.delete").click(function () {
                                                    deleteitem = $(this).parent().parent().parent();
                                                    deleteid = deleteitem.attr("name");
                                                    deleteurl = 'tweet/delete/';
                                                    type = "tweet";
                                                    $("#delete-dialog").dialog("open");
                                                });
                                            }
                                        });
                                    }
                                    UpdateNormal();
                                }
                            });
                        });
                    }
                });
            },
            "取消": function () {
                $(this).dialog("close");
            }
        }
    });
});

function ShowNormal(e) {
    page = e;
    $("div#profile").hide();
    $("div#blogs").show();
    $("div#profile-control").hide();
    $("div#ads").show();
    $.ajax({
        type: 'POST',
        url: 'search/poiuy/0/page/' + e,
        success: function (msg) {
            $("div#pages").fadeOut(50);
            $("div#blogsinner").html(msg);
            $("a.delete").click(function () {
                deleteitem = $(this).parent().parent().parent();
                deleteid = deleteitem.attr("name");
                deleteurl = 'tweet/delete/';
                type = "tweet";
                $("#delete-dialog").dialog("open");
            });
            UpdateNormal();
        }
    });
}

function UpdateNormal() {
    $.ajax({
        type: "POST",
        url: 'search/poiuy/0/count',
        success: function (msg) {
            msg = $.trim(msg);
            if (msg % 10 == 0) {
                allpage = Math.floor(msg / 10);
            }
            else {
                allpage = Math.floor(msg / 10) + 1;
            }
            if (allpage > 0) {
                prevLess = false;
                nextLess = false;
                var str = '<div id="pages-inner" class="right">';
                if (page != 0) {
                    str += '<a class="page-control left" id="prevPage">上一页</a>';
                }
                for (i = 0; i < allpage; i++) {
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
                    if (i == allpage - 1 && i - page > 2) {
                        str += '<a class="page-number left">' + (i + 1) + '</a>';
                        nextLess = true;
                    }
                    if (!nextLess && i - page > 2) {
                        nextLess = true;
                        str += '<span class="left">...</span>';
                    }
                }
                if (page != allpage - 1) {
                    str += '<a class="page-control left" id="nextPage">下一页</a>';
                }
                str += '</div>';
                $("div#pages").html(str);
                $("div#pages").fadeIn(200);
                $("a.page-number").click(function () {
                    page = $(this).html() - 1;
                    ShowNormal(page);
                    $(document).scrollTop(0);
                });
                $("a#prevPage").click(function () {
                    page--;
                    ShowNormal(page);
                    $(document).scrollTop(0);
                });
                $("a#nextPage").click(function () {
                    page++;
                    ShowNormal(page);
                    $(document).scrollTop(0);
                });
            }
        }
    });
}

function ShowFeedback(e) {
    page = e;
    $("div#profile").hide();
    $("div#blogs").show();
    $("div#profile-control").hide();
    $("div#ads").show();
    $.ajax({
        type: 'POST',
        url: 'feedback/show/' + e,
        success: function (msg) {
            $("div#pages").fadeOut(50);
            $("div#blogsinner").html(msg);
            $("a.delete").click(function () {
                deleteitem = $(this).parent().parent().parent();
                deleteid = deleteitem.attr("id");
                deleteurl = 'feedback/delete/';
                type = "feedback";
                $("#delete-dialog").dialog("open");
            });
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
            UpdateFeedback();
        }
    });
}

function UpdateFeedback() {
    $.ajax({
        type: "POST",
        url: 'feedback/show/count',
        success: function (msg) {
            msg = $.trim(msg);
            if (msg % 10 == 0) {
                allpage = Math.floor(msg / 10);
            }
            else {
                allpage = Math.floor(msg / 10) + 1;
            }
            if (allpage > 0) {
                prevLess = false;
                nextLess = false;
                var str = '<div id="pages-inner" class="right">';
                if (page != 0) {
                    str += '<a class="page-control left" id="prevPage">上一页</a>';
                }
                for (i = 0; i < allpage; i++) {
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
                    if (i == allpage - 1 && i - page > 2) {
                        str += '<a class="page-number left">' + (i + 1) + '</a>';
                        nextLess = true;
                    }
                    if (!nextLess && i - page > 2) {
                        nextLess = true;
                        str += '<span class="left">...</span>';
                    }
                }
                if (page != allpage - 1) {
                    str += '<a class="page-control left" id="nextPage">下一页</a>';
                }
                str += '</div>';
                $("div#pages").html(str);
                $("div#pages").fadeIn(200);
                $("a.page-number").click(function () {
                    page = $(this).html() - 1;
                    ShowFeedback(page);
                    $(document).scrollTop(0);
                });
                $("a#prevPage").click(function () {
                    page--;
                    ShowFeedback(page);
                    $(document).scrollTop(0);
                });
                $("a#nextPage").click(function () {
                    page++;
                    ShowFeedback(page);
                    $(document).scrollTop(0);
                });
            }
        }
    });
}
function ShowHot() {
}