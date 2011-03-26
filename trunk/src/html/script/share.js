var MR = false;
var ML = false;
var logined = true;
var isjob = false;
var length = 0;
var position = 0;
var rolekind = "";
var first = false;

$(function () {
    Init();
    SetCompany();
    SetSorts();
    CoverResize();
    SetRolePicker();
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
    if (logined) {
        $(".logined").show();
        $(".logouted").hide();
        if (isjob) {
            $(".jobs").show();
            $(".recruitment").hide();
        }
        else {
            $(".jobs").hide();
            $(".recruitment").show();
        }
    }
    else {
        $(".logined").hide();
        $(".logouted").show();
    }
}

function CompanyMR() {
    if (position + 840 < length) {
        $("#companies-inner").animate({ "left": "-=2" }, 10, "linear", function () {
            if (MR) {
                position += 2;
                CompanyMR();
            }
        });
    }
}
function CompanyML() {
    if (position > 0) {
        $("#companies-inner").animate({ "left": "+=2" }, 10, "linear", function () {
            if (ML) {
                position -= 2;
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
        $(this).animate({ opacity: 1 }, 200);
    });
    $("#company-control-right").mouseout(function () {
        if (MR) {
            MR = false;
        }
        $(this).animate({ opacity: 0.4 }, 200);
    });
    $("#company-control-left").mouseover(function () {
        if (!ML) {
            ML = true;
            CompanyML();
        }
        $(this).animate({ opacity: 1 }, 200);
    });
    $("#company-control-left").mouseout(function () {
        if (ML) {
            ML = false;
        }
        $(this).animate({ opacity: 0.4 }, 200);
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
    $(".sorts-item").mouseover(function () { $(this).addClass("sorts-item-over") });
    $(".sorts-item").mouseout(function () { $(this).removeClass("sorts-item-over") });

    $("#sorts-name").click(function () { $("#sorts").fadeOut(200) });
    $("#sorts-triangle").click(function () { $("#sorts").fadeOut(200) });
    $("#sort-triangle").click(function () { $("#sorts").fadeIn(200) });
    $("#sort").click(function () { $("#sorts").fadeIn(200) });
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
        $("div#cover").fadeOut(200);
        $("div#role-choose").fadeOut(200);
    });

    if (first) {
        $("div#cover").fadeIn(200);
        $("div#role-choose").fadeIn(200);
    }
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