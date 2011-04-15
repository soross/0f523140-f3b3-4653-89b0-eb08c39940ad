var allpage;
var page;

$(function () {

    $("#confirmBox_ok").position({
        of: $("html"),
        my: "center top",
        at: "center top",
        offset: "0 200",
        collision: "none none"
    });
    $("#confirmBox_ok").css("position", "fixed");
    $("#confirmBox_del").position({
        of: $("html"),
        my: "center top",
        at: "center top",
        offset: "0 200",
        collision: "none none"
    });
    $("#confirmBox_del").css("position", "fixed");
    $.ajax({
        type: 'POST',
        url: 'avatar/',
        success: function (msg) {
            $("#headpic").attr("src", msg);
        }
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
                //location = "/?search=" + encodeURI($("#search-text").val()) + "&cat=" + cate;
                location = "default?search=" + encodeURI($("#search-text").val()) + "&cat=" + $("#sort").attr("name");
            }
        }
    });
    $("a#search-button").click(function () {
        if ($("#search-text").val() != "职位关键字，如：北京 产品经理 阿里巴巴") {
            //location = "/?search=" + encodeURI($("#search-text").val()) + "&cat=" + cate;
        	location = "default?search=" + encodeURI($("#search-text").val()) + "&cat=" + $("#sort").attr("name");
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
        toolbar: [['NewPage', 'Save', 'Preview', '-', 'Templates'], ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord'], ['Undo', 'Redo', '-', 'Find', 'Replace', '-', 'SelectAll', 'RemoveFormat'], ['Image', 'Table', 'HorizontalRule', 'SpecialChar', 'PageBreak'], '/', ['Bold', 'Italic', 'Underline', 'Strike', '-', 'Subscript', 'Superscript'], ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', 'Blockquote'], ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'], ['Link', 'Unlink', 'Anchor'], '/', ['Styles', 'Format', 'Font', 'FontSize'], ['TextColor', 'BGColor']],
        resize_enabled: false,
        filebrowserBrowseUrl: 'ckfinder/ckfinder.html',
        filebrowserImageBrowseUrl: 'ckfinder/ckfinder.html?Type=Images',
        filebrowserImageUploadUrl: 'ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Images'
    });
    CKFinder.setupCKEditor(editor, "ckfinder/");


    var sort = $.query.get("type");
    if (sort == "profile") {
        ShowProfile();
        $("a.manager-control").removeClass("manager-control-choose");
        $("#myprofile").addClass("manager-control-choose");
    }
    else {
        ShowNormal(0);
    }

    $("a#profile-save").click(function () {
        $.ajax({
            type: 'POST',
            url: 'resume/update',
            data: {
                name: $("#u-name").val(),
                sex: $("input[name='dsex']:checked=\"checked\"").val(),
                date_birth: $("#birthday").val(),
                live_in_now: $("#n-positon").val(),
                live_in: $("#o-positon").val(),
                cellphone: $("#m-phone").val(),
                email: $("#email").val(),
                content: editor.document.getBody().getHtml()
            },
            success: function (msg) {
                $('#confirmBox_ok').show();
            }
        });
    });
    $("a#profile-preview").click(function () {

        $("#h-name").val($("#u-name").val());
        $("#h-sex").val($("input[name='dsex']:checked").val());
        $("#date_birth").val($("#birthday").val());
        $("#live_in_now").val($("#n-positon").val());
        $("#live_in").val($("#o-positon").val());
        $("#cellphone").val($("#m-phone").val());
        $("#h-email").val($("#email").val());
        $("#h-content").val(editor.document.getBody().getHtml());

        $("#ResumeForm").submit();
    });


    $("a.apply").live("click", function () {
        var item = $(this);
        var id = $(this).parent().parent().parent().attr("id");
        $.ajax({
            type: "POST",
            url: 'apply_sent/add/' + id,
            success: function () {
                item.hide();
                item.next("a.unapply").show();
            }
        });
    });
    $("a.unapply").live("click", function () {
        var item = $(this);
        var id = $(this).parent().parent().parent().attr("id");
        $.ajax({
            type: "POST",
            url: 'apply_sent/delete/' + id,
            success: function () {
                item.hide();
                item.prev("a.apply").show();
            }
        });
    });
    $("div.item").live("mouseover", function () {
        $(this).addClass("item-over");
    });
    $("div.item").live("mouseout", function () {
        $(this).removeClass("item-over");
    });
    
    SetSorts();
});

function Delete() {
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
                                url: 'apply_sent/show/',
                                data: { page: page },
                                success: function (msg) {
                                    var str = '<div class="item newer" style="display:none;"';
                                    str += msg.split('<div class="item"')[10];
                                    $("div.item:last").after(str);
                                    $(".newer:last").slideDown(200);
                                    $("div.item-delete a").unbind("click");
                                    $("div.item-delete a").click(function () {
                                        deleteitem = $(this).parent().parent();
                                        deleteid = deleteitem.attr("id");
                                        deleteurl = 'apply_sent/delete/';
                                        type = "apply";
                                        $('#confirmBox_del').show();
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
                                url: 'like/show/',
                                data: { page: page },
                                success: function (msg) {
                                    var str = '<div class="item newer" style="display:none;"';
                                    str += msg.split('<div class="item"')[10];
                                    $("div.item:last").after(str);
                                    $(".newer:last").slideDown(200);
                                    $("a.delete").unbind("click");
                                    $("div.item-delete a").unbind("click");
                                    $("a.delete").click(function () {
                                        deleteitem = $(this).parent().parent().parent();
                                        deleteid = deleteitem.attr("id");
                                        deleteurl = 'like/delete/';
                                        type = "like";
                                        $('#confirmBox_del').show();
                                    });
                                    $("div.item-delete a").click(function () {
                                        deleteitem = $(this).parent().parent();
                                        deleteid = deleteitem.attr("id");
                                        deleteurl = 'like/delete/';
                                        type = "like";
                                        $('#confirmBox_del').show();
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
                                url: 'user/show/',
                                data: { page: page },
                                success: function (msg) {
                                    var str = '<div class="item newer" style="display:none;"';
                                    str += msg.split('<div class="item"')[10];
                                    $("div.item:last").after(str);
                                    $(".newer:last").slideDown(200);
                                    $("a.delete").unbind("click");
                                    $("div.item-delete a").unbind("click");
                                    $("a.delete").click(function () {
                                        deleteitem = $(this).parent().parent().parent();
                                        deleteid = deleteitem.attr("id");
                                        deleteurl = 'tweet/delete/';
                                        type = "tweet";
                                        $('#confirmBox_del').show();
                                    });
                                    $("div.item-delete a").click(function () {
                                        deleteitem = $(this).parent().parent();
                                        deleteid = deleteitem.attr("id");
                                        deleteurl = 'tweet/delete/';
                                        $('#confirmBox_del').show();
                                    });
                                }
                            });
                        }
                        UpdateTweet();
                    }
                });
            });
            $("#confirmBox_del").hide();
        }
    });
}

function AfterLogin() {
    $.ajax({
        type: 'POST',
        url: '/user/info/',
        success: function (msg) {
            msg = $.trim(msg);
            var username = msg.split(',')[0];
            var type = msg.split(',')[1];
            $("#name").html(username);
            if (type == 1) {
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
}

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
                $("input[name='dsex']").each(function () {
                    if ($(this).val() == msg.split('|')[1]) {
                        $(this).attr("checked", "checked");
                    }
                });
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
        url: 'apply_received/show_tweet/' + id,
        data: { page: current },
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
        url: 'apply_received/count',
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
        url: 'apply_received/show/',
        data: { page: page },
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
        url: 'apply_sent/show/',
        data: { page: page },
        success: function (msg) {
            $("div#pages").fadeOut(50);
            $("div#blogsinner").html(msg);
            $("div.item-delete a").click(function () {
                deleteitem = $(this).parent().parent();
                deleteid = deleteitem.attr("id");
                deleteurl = 'apply_sent/delete/';
                type = "apply";
                $('#confirmBox_del').show();
            });
            $(".job-closed").animate({ opacity: 0.4 }, 0);
            UpdateApply();
        }
    });
}

function UpdateApply() {
    $.ajax({
        type: "POST",
        url: 'apply_sent/count',
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
    $("div#profile").hide();
    $("div#blogs").show();
    $("div#profile-control").hide();
    $("div#ads").show();
    $.ajax({
        type: 'POST',
        url: 'like/show/',
        data: { page: e },
        success: function (msg) {
            $("div#pages").fadeOut(50);
            $("div#blogsinner").html(msg);
            $("a.delete").click(function () {
                deleteitem = $(this).parent().parent().parent();
                deleteid = deleteitem.attr("id");
                deleteurl = 'like/delete/';
                type = "like";
                $('#confirmBox_del').show();
            });
            $("div.item-delete a").click(function () {
                deleteitem = $(this).parent().parent();
                deleteid = deleteitem.attr("id");
                deleteurl = 'like/delete/';
                type = "like";
                $('#confirmBox_del').show();
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
        url: 'user/show',
        data: { page: page },
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
                $('#confirmBox_del').show();
            });
            $("div.item-delete a").click(function () {
                deleteitem = $(this).parent().parent();
                deleteid = deleteitem.attr("id");
                deleteurl = 'tweet/delete/';
                $('#confirmBox_del').show();
            });
            UpdateTweet();
        }
    });
}

function UpdateTweet() {
    $.ajax({
        type: "POST",
        url: 'user/count',
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