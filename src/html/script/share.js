var MR = false;
var ML = false;
var logined = true;
var rolekind = "jobs";
var auth = "";
var length = 0;
var position = 0;

$(function () {
    Init();
    SetCompany();
    SetSorts();
    CoverResize();
    SetPublish();
});
function SetPublish() {
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
    $("div#jobs-publish-confirm a").click(function () { HideJobsPublish(); });
    $("div#recruitment-publish-title a").click(function () { HideRecruitmentPublish(); });
    $("div#recruitment-publish-confirm a").click(function () { HideRecruitmentPublish(); });

    $("a.jobs-publish-tags-hot-item").click(function () {
        $("div#jobs-publish-tags input").val($("div#jobs-publish-tags input").val() + " " + $(this).attr("title"));
    });
    $("a.recruitment-publish-tags-hot-item").click(function () {
        $("div#recruitment-publish-tags input").val($("div#recruitment-publish-tags input").val() + " " + $(this).attr("title"));
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
        $(".logined").hide();
        $(".logouted").show();
    }
    $("input#search-text").focusin(function () {
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

function CompanyMR() {
    if (position + 840 < length) {
        $("#companies-inner").animate({ "left": "-=2" }, 10, "linear", function () {
            position += 2;
            if (MR) {
                CompanyMR();
            }
        });
    }
}
function CompanyML() {
    if (position > 0) {
        $("#companies-inner").animate({ "left": "+=2" }, 10, "linear", function () {
            position -= 2;
            if (ML) {
                CompanyML();
            }
        });
    }
}
function SetCompany() {
    $("#company-control-right").animate({ opacity: 0.4 }, 0);
    $("#company-control-left").animate({ opacity: 0.4 }, 0);
    $("#company-control-right").mouseover(function () {
        if (!MR) {
            MR = true;
            CompanyMR();
        }
        $(this).stop().animate({ opacity: 1 }, 200);
    });
    $("#company-control-right").mouseout(function () {
        if (MR) {
            MR = false;
        }
        $(this).stop().animate({ opacity: 0.4 }, 200);
    });
    $("#company-control-left").mouseover(function () {
        if (!ML) {
            ML = true;
            CompanyML();
        }
        $(this).stop().animate({ opacity: 1 }, 200);
    });
    $("#company-control-left").mouseout(function () {
        if (ML) {
            ML = false;
        }
        $(this).stop().animate({ opacity: 0.4 }, 200);
    });

    length = $("a.company-name:last").position().left + $("a.company-name:last").outerWidth("ture");
}

function SetSorts() {
    $("div#sorts").position({
        of: $("a#sort"),
        my: "left top",
        at: "left top",
        offset: "-5 -10",
        collision: "none none"
    });
    $.ajax({
        type: "POST",
        url: 'cate',
        success: function (msg) {
            $("#sorts-content").html(msg);
            $(".sorts-item").mouseover(function () { $(this).addClass("sorts-item-over") });
            $(".sorts-item").mouseout(function () { $(this).removeClass("sorts-item-over") });
            $(".sorts-item a").click(function () {
                $("a#sorts-name").html($(this).html());
                $("a#sort").html($(this).html());
                $("#sorts").fadeOut(200);
            });
        }
    });
    $("#sorts-name").click(function () { $("#sorts").fadeOut(200) });
    $("#sorts-triangle").click(function () { $("#sorts").fadeOut(200) });
    $("#sort-triangle").click(function () { $("#sorts").fadeIn(200) });
    $("#sort").click(function () { $("#sorts").fadeIn(200) });
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
    $("div#cover").css("height", pageHeight + "px");
    $("div#cover").css("width", pageWidth + "px");
    $("div#cover").animate({ opacity: 0.4 }, 0);
}