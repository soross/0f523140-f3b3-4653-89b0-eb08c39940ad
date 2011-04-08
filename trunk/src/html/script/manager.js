var deleteitem;
var deleteid;
var deleteurl;
var page = 0;
var allpage = 0;
var type = "";
var editor;

$(function () {

    $("div#profile-info").dialog({
        autoOpen: false,
        draggable: false,
        resizable: false,
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
    $("#search-text").keydown(function () {
        if ($(this).val().length > 32) {
            $(this).val($(this).val().substring(0, 32));
        }
    });
    $("#search-text").keyup(function () {
        if ($(this).val().length > 32) {
            $(this).val($(this).val().substring(0, 32));
        }
    });

    $("#search-text").keypress(function (e) {
        if (e.which == 13) {
            if ($("#search-text").val() != "职位关键字，如：北京 产品经理 阿里巴巴") {
                location = "/?search=" + encodeURI($("#search-text").val()) + "&cat=" + cate;
            }
        }
    });
    $("a#search-button").click(function () {
        if ($("#search-text").val() != "职位关键字，如：北京 产品经理 阿里巴巴") {
            location = "/?search=" + encodeURI($("#search-text").val()) + "&cat=" + cate;
        }
    });

    $("a.company-name").click(function () {
        var text = $(this).html();
        location = "/?search=" + encodeURI(text) + "&cat=0";
    });

    $("#birthday").datepicker({
        changeMonth: true,
        changeYear: true
    });
    editor = CKEDITOR.replace('profile-detail', {
        uiColor: '#d1e9f1',
        language: 'zh-cn',
        toolbar: [['NewPage', 'Save', 'Preview', '-', 'Templates'], ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord'], ['Undo', 'Redo', '-', 'Find', 'Replace', '-', 'SelectAll', 'RemoveFormat'], '/', ['Bold', 'Italic', 'Underline', 'Strike', '-', 'Subscript', 'Superscript'], ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', 'Blockquote'], ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'], ['Link', 'Unlink', 'Anchor'], ['Image', 'Table', 'HorizontalRule', 'SpecialChar', 'PageBreak'], '/', ['Styles', 'Format', 'Font', 'FontSize'], ['TextColor', 'BGColor']],
        resize_enabled: false,
        filebrowserBrowseUrl: 'ckfinder/ckfinder.html',
        filebrowserImageBrowseUrl: 'ckfinder/ckfinder.html?Type=Images',
        filebrowserImageUploadUrl: 'ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Images'
    });
    CKFinder.setupCKEditor(editor, "ckfinder/");

    $("div#info-pic a").click(function () {
        var finder = new CKFinder();
        finder.basePath = 'ckfinder/';
        finder.selectActionFunction = SetFileField;
        finder.popup();
    });

    $("a#profile-save").click(function () {
        $.ajax({
            type: 'POST',
            url: 'resume/add',
            data: {
                name: $("#u-name").val(),
                sex: $("#sex").val(),
                date_birth: $("#birthday").val(),
                live_in_now: $("#n-positon").val(),
                live_in: $("#o-positon").val(),
                cellphone: $("#m-phone").val(),
                email: $("#email").val(),
                content: editor.document.getBody().getHtml()
            },
            success: function (msg) {
                $("div#profile-info").dialog("open");
            }
        });
    });
    $("a#profile-preview").click(function () {
        $.ajax({
            type: 'POST',
            url: 'resume/preview',
            data: {
                name: $("#u-name").val(),
                sex: $("#sex").val(),
                date_birth: $("#birthday").val(),
                live_in_now: $("#n-positon").val(),
                live_in: $("#o-positon").val(),
                cellphone: $("#m-phone").val(),
                email: $("#email").val(),
                content: editor.document.getBody().getHtml()
            },
            success: function (msg) {
                var obj = window.open("/resume");
                obj.document.write(msg);
            }
        });
    });

    $("a.applys").click(function () {
        var item = $(this).parent().next(".item-applys");
        if (item.hasClass("close")) {
            item.slideDown(200);
            item.removeClass("close");
        }
        else {
            item.slideUp(200);
            item.addClass("close");
        }
    });

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
                                if (type == "apply") {
                                    if (flag) {
                                        $.ajax({
                                            type: 'POST',
                                            url: 'apply/show/' + page,
                                            success: function (msg) {
                                                var str = '<div class="item newer" style="display:none;"';
                                                str += msg.split('<div class="item"')[10];
                                                $("div.item:last").after(str);
                                                $(".newer:last").slideDown(200);
                                                $("div.item").unbind("mouseover");
                                                $("div.item").unbind("mouseout");
                                                $("div.item-delete a").unbind("click");
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
                                            }
                                        });
                                    }
                                    UpdateApply();
                                }
                                else if (type == "like") {
                                    if (flag) {
                                        $.ajax({
                                            type: 'POST',
                                            url: 'like/show/' + page,
                                            success: function (msg) {
                                                var str = '<div class="item newer" style="display:none;"';
                                                str += msg.split('<div class="item"')[10];
                                                $("div.item:last").after(str);
                                                $(".newer:last").slideDown(200);
                                                $("a.apply").unbind("click");
                                                $("a.unapply").unbind("click");
                                                $("div.item").unbind("mouseover");
                                                $("div.item").unbind("mouseout");
                                                $("a.delete").unbind("click");
                                                $("div.item-delete a").unbind("click");
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
                                            }
                                        });
                                    }
                                    UpdateFavourite();
                                }
                                else if (type == "tweet") {
                                    if (flag) {
                                        $.ajax({
                                            type: 'POST',
                                            url: 'user/current/0/' + page,
                                            success: function (msg) {
                                                var str = '<div class="item newer" style="display:none;"';
                                                str += msg.split('<div class="item"')[10];
                                                $("div.item:last").after(str);
                                                $(".newer:last").slideDown(200);
                                                $("div.item").unbind("mouseover");
                                                $("div.item").unbind("mouseout");
                                                $("a.delete").unbind("click");
                                                $("div.item-delete a").unbind("click");
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
                                            }
                                        });
                                    }
                                    UpdateTweet();
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

    var sort = $.query.get("type");
    if (sort == "profile") {
        ShowProfile();
        $("a.manager-control").removeClass("manager-control-choose");
        $("#myprofile").addClass("manager-control-choose");
    }
    else {
        ShowNormal(0);
    }
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

function SetContent(id, datas, item, count) {
    var current = datas.attr("name");
    $.ajax({
        type: 'POST',
        url: 'received/apply/' + id + "/" + current,
        success: function (msg) {
            item.html(msg);
            $("a.item-applys-read").each(function () {
                $(this).attr("href", "resume/show/" + $(this).parent().attr("id"));
                $(this).attr("target", "_blank");
            });
            var allpage = 0;
            if (count % 10 == 0) {
                allpage = Math.floor(count / 10);
            }
            else {
                allpage = Math.floor(count / 10) + 1;
            }
            item.next(".item-page").html('');
            if (allpage > 1) {
                if (current != allpage - 1) {
                    item.next(".item-page").html('<a class="right">下一页</a>');
                    item.next(".item-page").children("a:first").click(function () {
                        datas.attr("name", current + 1);
                        SetContent(id, datas, item, count);
                    });
                }
                if (current != 0) {
                    item.next(".item-page").html(item.next(".item-page").html() + '<a class="right">上一页</a>');
                    item.next(".item-page").children("a:last").click(function () {
                        datas.attr("name", current - 1);
                        SetContent(id, datas, item, count);
                    });
                }
            }
            item.slideDown(200);
            item.next(".item-page").slideUp(200);
            item.removeClass("close");
        }
    });
}

function UpdateApplys() {
    $.ajax({
        type: "POST",
        url: 'received/count',
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
                    ShowApplys(page);
                    $(window).scrollTop(0);
                });
                $("a#prevPage").click(function () {
                    page--;
                    ShowApplys(page);
                    $(window).scrollTop(0);
                });
                $("a#nextPage").click(function () {
                    page++;
                    ShowApplys(page);
                    $(window).scrollTop(0);
                });
            }
        }
    });
}

function ShowApplys(e) {
    page = e;
    $("div#profile").hide();
    $("div#blogs").show();
    $("div#profile-control").hide();
    $("div#ads").show();
    $.ajax({
        type: 'POST',
        url: 'received/' + e,
        success: function (msg) {
            $("div#pages").fadeOut(50);
            $("div#blogsinner").html(msg);
            $("a.applys").click(function () {
                var datas = $(this);
                var count = $(this).attr("id");
                $(this).attr("name", "0");
                var id = $(this).parent().parent().parent().attr("id");
                var item = $(this).parent().next(".item-applys");
                if (item.hasClass("close")) {
                    SetContent(id, datas, item, count);
                }
                else {
                    item.slideUp(200);
                    item.next(".item-page").slideUp(200);
                    item.addClass("close");
                }
            });
            UpdateApplys();
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
    page = e;
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
            $(".job-closed").animate({ opacity: 0.4 }, 0);
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
                    $(window).scrollTop(0);
                });
                $("a#prevPage").click(function () {
                    page--;
                    ShowApply(page);
                    $(window).scrollTop(0);
                });
                $("a#nextPage").click(function () {
                    page++;
                    ShowApply(page);
                    $(window).scrollTop(0);
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
                    $(window).scrollTop(0);
                });
                $("a#prevPage").click(function () {
                    page--;
                    ShowFavourite(page);
                    $(window).scrollTop(0);
                });
                $("a#nextPage").click(function () {
                    page++;
                    ShowFavourite(page);
                    $(window).scrollTop(0);
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
                    $(window).scrollTop(0);
                });
                $("a#prevPage").click(function () {
                    page--;
                    ShowNormal(page);
                    $(window).scrollTop(0);
                });
                $("a#nextPage").click(function () {
                    page++;
                    ShowNormal(page);
                    $(window).scrollTop(0);
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
                $(".admin").hide();
            }
            else if (type == 2) {
                $(".recruitment").fadeIn(300);
                $(".jobs").hide();
                $(".admin").hide();
            }
            else if (type == 0) {
                $(".admin").show();
                $(".jobs").hide();
                $(".recruitment").show();
            }
        }
    });
}

function SetFileField(fileUrl) {
    $("div#info-pic img").attr("src", fileUrl);
}