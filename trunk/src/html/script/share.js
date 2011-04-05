var logined = true;
var rolekind = "jobs";
var auth = "";
var length = 0;
var position = 0;
var cate = 0;

$(function () {
    Init();
    CoverResize();
    SetPublish();
});
function SetPublish() {
    $("div#published-info").dialog({
        autoOpen: false,
        buttons: {
            "好的，我知道了": function () {
                $(this).dialog("close");
            }
        }
    });
    $("div#jobs-publish").position({
        of: $("body"),
        my: "center top",
        at: "center top",
        offset: "0 130",
        collision: "none none"
    });
    $("div#recruitment-publish").position({
        of: $("body"),
        my: "center top",
        at: "center top",
        offset: "0 130",
        collision: "none none"
    });
    $("div#jobs-publish-title a").click(function () { HideJobsPublish(); });
    $("div#recruitment-publish-title a").click(function () { HideRecruitmentPublish(); });


    $("div#jobs-publish-confirm a").click(function () {
        $.ajax({
            type: 'POST',
            url: 'post/1',
            data: { text: $("div#jobs-publish-text textarea").val() },
            success: function (msg) {
                if ($.trim(msg) != "0") {
                    alert(msg);
                }
                HideJobsPublish();
                $("div#published-info").dialog("open");
            }
        });
    });
    $("div#recruitment-publish-confirm a").click(function () {
        $.ajax({
            type: 'POST',
            url: 'post/2',
            data: { text: $("div#recruitment-publish-text textarea").val() },
            success: function (msg) {
                if ($.trim(msg) != "0") {
                    alert(msg);
                }
                HideRecruitmentPublish();
                $("div#published-info").dialog("open");
            }
        });
    });
    //Jobs Hot Tags
    $.ajax({
        type: 'POST',
        url: 'hot/1',
        success: function (msg) {
            $("div#jobs-publish-tags-hot").html(msg);
            $("a.jobs-publish-tags-hot-item").click(function () {
                $("div#jobs-publish-text textarea").val($("div#jobs-publish-text textarea").val() + " " + $(this).attr("title"));
                UpdateJobsText();
            });
        }
    });
    //Recruitment Hot Tags
    $.ajax({
        type: 'POST',
        url: 'hot/2',
        success: function (msg) {
            $("div#recruitment-publish-tags-hot").html(msg);
            $("a.recruitment-publish-tags-hot-item").click(function () {
                $("div#recruitment-publish-text textarea").val($("div#recruitment-publish-text textarea").val() + " " + $(this).attr("title"));
                UpdateRecruitmentText();
            });
        }
    });
    $("div#jobs-publish-text textarea").keydown(function () {
        UpdateJobsText();
    });
    $("div#recruitment-publish-text textarea").keydown(function () {
        UpdateRecruitmentText();
    });
    $("div#jobs-publish-text textarea").keyup(function () {
        UpdateJobsText();
    });
    $("div#recruitment-publish-text textarea").keyup(function () {
        UpdateRecruitmentText();
    });
    $("a#jobs-publish-quick").click(function () { ShowJobsPublish(); });
    $("a#recruitment-publish-quick").click(function () { ShowRecruitmentPublish(); });
    UpdateJobsText();
    UpdateRecruitmentText();
}

function UpdateJobsText() {
    if (140 - $("div#jobs-publish-text textarea").val().length >= 0) {
        $("div#jobs-publish-remain").html("还可输入" + (140 - $("div#jobs-publish-text textarea").val().length) + "个字");
    }
    else {
        $("div#jobs-publish-remain").html("已超出" + ($("div#jobs-publish-text textarea").val().length - 140) + "个字");
    }
}
function UpdateRecruitmentText() {
    if (140 - $("div#recruitment-publish-text textarea").val().length >= 0) {
        $("div#recruitment-publish-remain").html("还可输入" + (140 - $("div#recruitment-publish-text textarea").val().length) + "个字");
    }
    else {
        $("div#recruitment-publish-remain").html("已超出" + ($("div#recruitment-publish-text textarea").val().length - 140) + "个字");
    }
}
function ShowJobsPublish() {
    $("div#cover").fadeIn(200);
    $("div#jobs-publish").fadeIn(200);
}
function HideJobsPublish() {
    $("div#cover").fadeOut(200);
    $("div#jobs-publish").fadeOut(200);
}
function ShowRecruitmentPublish() {
    $("div#cover").fadeIn(200);
    $("div#recruitment-publish").fadeIn(200);
}
function HideRecruitmentPublish() {
    $("div#cover").fadeOut(200);
    $("div#recruitment-publish").fadeOut(200);
}

function Init() {
    auth = $.cookie("USER_AUTH");
    if (auth == null) {
        logined = false;
    }
    else {
        logined = true;
    }
    if (logined) {
        AfterLogin();
    }
    else {
        $(".logouted").fadeIn(300);
    }
    $("input#search-text").focusin(function () {
        $("#sorts").fadeOut(200);
        $(this).css("color", "#000000");
        if ($(this).val() == "职位关键字，如：北京 产品经理 阿里巴巴") {
            $(this).val("");
        }
    });
    $("input#search-text").focusout(function () {
        $(this).css("color", "#adadad");
        if ($(this).val() == "") {
            $(this).val("职位关键字，如：北京 产品经理 阿里巴巴");
        }
    });
}

function CoverResize() {
    var xScroll, yScroll;
    if (window.innerHeight && window.scrollMaxY) {
        xScroll = window.innerWidth + window.scrollMaxX;
        yScroll = window.innerHeight + window.scrollMaxY;
    } else if (document.body.scrollHeight > document.body.offsetHeight) {
        xScroll = document.body.scrollWidth;
        yScroll = document.body.scrollHeight;
    } else {
        xScroll = document.body.offsetWidth;
        yScroll = document.body.offsetHeight;
    }
    var windowWidth, windowHeight;
    if (self.innerHeight) {
        if (document.documentElement.clientWidth) {
            windowWidth = document.documentElement.clientWidth;
        } else {
            windowWidth = self.innerWidth;
        }
        windowHeight = self.innerHeight;
    } else if (document.documentElement && document.documentElement.clientHeight) {
        windowWidth = document.documentElement.clientWidth;
        windowHeight = document.documentElement.clientHeight;
    } else if (document.body) {
        windowWidth = document.body.clientWidth;
        windowHeight = document.body.clientHeight;
    }
    if (yScroll < windowHeight) {
        pageHeight = windowHeight;
    } else {
        pageHeight = yScroll;
    }
    if (xScroll < windowWidth) {
        pageWidth = xScroll;
    } else {
        pageWidth = windowWidth;
    }
    $("div#cover").css("height", "5000px");
    $("div#cover").css("width", pageWidth + "px");
    $("div#cover").animate({ opacity: 0.4 }, 0);
}