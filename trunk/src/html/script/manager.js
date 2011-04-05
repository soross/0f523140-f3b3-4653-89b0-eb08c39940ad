var deleteitem;
var deleteid;
var deleteurl;
var page = 0;
var allpage = 0;
var type = "";

$(function () {

    $("div#profile-info").dialog({
        autoOpen: false,
        buttons: {
            "确定": function () {
                $(this).dialog("close");
            }
        }
    });
    //    $("div#content-middle-delete a").animate({ opacity: 0.6 }, 0);
    //    $("div#content-middle-delete a").mouseover(function () {
    //        $(this).stop().animate({ opacity: 1 }, 200);
    //    });
    //    $("div#content-middle-delete a").mouseout(function () {
    //        $(this).stop().animate({ opacity: 0.6 }, 200);
    //    });

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
    $.ajax({
        type: 'GET',
        url: 'resume/show',
        success: function (msg) {
            if ($.trim(msg).indexOf('|') != -1) {
                $("#u-name").val(msg.split('|')[0]);
                $("#sex").val(msg.split('|')[1]);
                $("#birthday").val(msg.split('|')[2]);
                $("#n-positon").val(msg.split('|')[3]);
                $("#o-positon").val(msg.split('|')[4]);
                $("#m-phone").val(msg.split('|')[5]);
                $("#email").val(msg.split('|')[6]);
                var str = "";
                for (s in msg.split('|')) {
                    if (s == 7) {
                        str += msg.split('|')[s];
                    }
                    else if (s >= 7) {
                        str += '|' + msg.split('|')[s];
                    }
                }
                editor.setData(str);
            }
        }
    });
}

function ShowApplys() {
    $("div#profile").hide();
    $("div#blogs").show();
    $("div#profile-control").hide();
    $("div#ads").show();
    $.ajax({
        type: 'POST',
        url: 'receive',
        success: function (msg) {
            $("div#pages").fadeOut(50);
            $("div#blogsinner").html(msg);
//            $("div.item").mouseover(function () {
//                $(this).addClass("item-over");
//            });
//            $("div.item").mouseout(function () {
//                $(this).removeClass("item-over");
//            });
//            $("div.item-delete a").click(function () {
//                deleteitem = $(this).parent().parent();
//                deleteid = deleteitem.attr("id");
//                deleteurl = 'apply/delete/';
//                type = "apply";
//                $("#delete-dialog").dialog("open");
//            });
//            UpdateApply();
        }
    });
}

function ShowApply(e) {
    $("div#profile").hide();
    $("div#blogs").show();
    $("div#profile-control").hide();
    $("div#ads").show();
    $.ajax({
        type: 'POST',
        url: 'apply/show/' + e,
        success: function (msg) {
            $("div#pages").fadeOut(50);
            $("div#blogsinner").html(msg);
            $("div.item").mouseover(function () {
                $(this).addClass("item-over");
            });
            $("div.item").mouseout(function () {
                $(this).removeClass("item-over");
            });
            $("div.item-delete a").click(function () {
                deleteitem = $(this).parent().parent();
                deleteid = deleteitem.attr("id");
                deleteurl = 'apply/delete/';
                type = "apply";
                $("#delete-dialog").dialog("open");
            });
            UpdateApply();
        }
    });
}

function UpdateApply() {
    $.ajax({
        type: "POST",
        url: 'apply/count',
        success: function (msg) {
            msg = $.trim(msg);
            $("span#blogs-count").html("共有" + msg + "条记录");
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
                    ShowApply(page);
                    $(document).scrollTop(0);
                });
                $("a#prevPage").click(function () {
                    page--;
                    ShowApply(page);
                    $(document).scrollTop(0);
                });
                $("a#nextPage").click(function () {
                    page++;
                    ShowApply(page);
                    $(document).scrollTop(0);
                });
            }
        }
    });
}

function ShowFavourite(e) {
    page = e;
    $("div#profile").hide();
    $("div#blogs").show();
    $("div#profile-control").hide();
    $("div#ads").show();
    $.ajax({
        type: 'POST',
        url: 'like/show/' + e,
        success: function (msg) {
            $("div#pages").fadeOut(50);
            $("div#blogsinner").html(msg);
            $("a.apply").click(function () {
                var item = $(this);
                var id = $(this).parent().parent().parent().attr("id");
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
                var id = $(this).parent().parent().parent().attr("id");
                $.ajax({
                    type: "POST",
                    url: 'apply/delete/' + id,
                    success: function () {
                        item.hide();
                        item.prev("a.apply").show();
                    }
                });
            });
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
                type = "like";
                $("#delete-dialog").dialog("open");
            });
            $("div.item-delete a").click(function () {
                deleteitem = $(this).parent().parent();
                deleteid = deleteitem.attr("id");
                deleteurl = 'like/delete/';
                type = "like";
                $("#delete-dialog").dialog("open");
            });
            UpdateFavourite();
        }
    });
}

function UpdateFavourite() {
    $.ajax({
        type: "POST",
        url: 'like/count',
        success: function (msg) {
            msg = $.trim(msg);
            $("span#blogs-count").html("共有" + msg + "条记录");
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
                    ShowFavourite(page);
                    $(document).scrollTop(0);
                });
                $("a#prevPage").click(function () {
                    page--;
                    ShowFavourite(page);
                    $(document).scrollTop(0);
                });
                $("a#nextPage").click(function () {
                    page++;
                    ShowFavourite(page);
                    $(document).scrollTop(0);
                });
            }
        }
    });
}

function ShowNormal(e) {
    page = e;
    $("div#profile").hide();
    $("div#blogs").show();
    $("div#profile-control").hide();
    $("div#ads").show();
    $.ajax({
        type: 'POST',
        url: 'user/current/0/' + e,
        success: function (msg) {
            $("div#pages").fadeOut(50);
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
                type = "tweet";
                $("#delete-dialog").dialog("open");
            });
            $("div.item-delete a").click(function () {
                deleteitem = $(this).parent().parent();
                deleteid = deleteitem.attr("id");
                deleteurl = 'tweet/delete/';
                $("#delete-dialog").dialog("open");
            });
            UpdateTweet();
        }
    });
}

function UpdateTweet() {
    $.ajax({
        type: "POST",
        url: 'user/current/0/count',
        success: function (msg) {
            msg = $.trim(msg);
            $("span#blogs-count").html("共有" + msg + "条记录");
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

function AfterLogin() {
    $.ajax({
        type: 'POST',
        url: 'info/',
        success: function (msg) {
            $(".logined").fadeIn(300);
            $("a#name").html(msg.split(',')[0]);
            $("div#links a:last").attr("href", "profile/" + msg.split(',')[0]);
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