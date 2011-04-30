﻿//User Login - share.js
var logined = false;
var rolekind = "";


function showError(msg){
	$("#errormsg").html(msg);
	$("#error-info").dialog("open");
}



$(function () {
$("#error-info").dialog({
        autoOpen: false,
        draggable: false,
        resizable: false,
        modal: true,
        buttons: {
            "确定": function () {
                $(this).dialog("close");
            }
        }
    });
    $("#logo").mouseover(function () {
        $(this).html("回首页");
    });
    $("#logo").mouseout(function () {
        $(this).html("测试版");
    });
    InitUser();
    SetPublish();

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
});

function InitUser() {
    auth = $.cookie("USER_AUTH");
    if (auth == null) {
        logined = false;
    }
    else {
        logined = true;
    }
    if (logined) {
        $(".logined").show();
        AfterLogin();
    }
    else {
        $(".logouted").show();
    }
}
//End of User Login

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
    $("body").css("overflow", "hidden");
    $("div#cover").css("height", pageHeight + "px");
    $("div#cover").css("width", pageWidth + "px");
    $("div#cover").animate({ opacity: 0.4 }, 0);
}

function SetPublish() {

    $("#popBox_publishok").position({
        of: $("html"),
        my: "center top",
        at: "center top",
        offset: "0 200",
        collision: "none none"
    });
    $("#popBox_publishok").css("position", "fixed");
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
            url: 'tweet/post/1',
            data: { text: $("div#jobs-publish-text textarea").val() },
            success: function (msg) {
                if ($.trim(msg) != "0" && $.trim(msg) != "") {
                	showError(msg);
                }
                HideJobsPublish();
                $("#popBox_publishok").show();
            }
        });
    });
    $("div#recruitment-publish-confirm a").click(function () {
    	$("#RecruitmentForm").submit();
					HideRecruitmentPublish();
				    var $window = jQuery(window);
				    var temp = ($window.width() - 50) / 2;
				    var controlx = temp >= 0 ? temp : 0;
				    temp = ($window.height() - 50) / 2;
				    var controly = $window.scrollTop() + (temp >= 0 ? temp : 0);
				    $("#LFlower").css({ left: controlx + 'px', top: controly + 'px', height: '50px', width: '50px' });
				    $("#LFlower").fadeIn(200);
    	$("#hf").load(function(){
    		if ($.trim($("#hf").contents().find("body").html()) != "0" && $.trim($("#hf").contents().find("body").html()) != "") {
					showError($.trim($("#hf").contents().find("body").html()));
                    //alert(msg);
                }else{
				    $("#LFlower").hide();
					$("#popBox_publishok").show();
				}
    	});
    });
    //Jobs Hot Tags
    $.ajax({
        type: 'POST',
        url: 'hot/tag/1',
        success: function (msg) {
            $("div#jobs-publish-tags-hot").html(msg);
            $("a.jobs-publish-tags-hot-item").click(function () {
                $("div#jobs-publish-text textarea").val($("div#jobs-publish-text textarea").val() + " " + $(this).attr("title"));
                UpdateJobsText();
                $("div#jobs-publish-text textarea").focus();
                $("div#jobs-publish-text textarea").val($("div#jobs-publish-text textarea").val());
            });
        }
    });
    //Recruitment Hot Tags
    $.ajax({
        type: 'POST',
        url: 'hot/tag/2',
        success: function (msg) {
            $("div#recruitment-publish-tags-hot").html(msg);
            $("a.recruitment-publish-tags-hot-item").click(function () {
                $("div#recruitment-publish-text textarea").val($("div#recruitment-publish-text textarea").val() + " " + $(this).attr("title"));
                UpdateRecruitmentText();
                $("div#recruitment-publish-text textarea").focus();
                $("div#recruitment-publish-text textarea").val($("div#recruitment-publish-text textarea").val());
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
    if (140 - Math.ceil($("div#jobs-publish-text textarea").val().replace(/[^\x00-\xff]/g, "**").length / 2) >= 0) {
        $("div#jobs-publish-remain").html("还可输入" + (140 - Math.ceil($("div#jobs-publish-text textarea").val().replace(/[^\x00-\xff]/g, "**").length / 2)) + "个字");
    }
    else {
        $("div#jobs-publish-remain").html("已超出" + (Math.ceil($("div#jobs-publish-text textarea").val().replace(/[^\x00-\xff]/g, "**").length / 2 - 140)) + "个字");
    }
}
function UpdateRecruitmentText() {
    if (140 - Math.ceil($("div#recruitment-publish-text textarea").val().replace(/[^\x00-\xff]/g, "**").length / 2) >= 0) {
        $("div#recruitment-publish-remain").html("还可输入" + (140 - Math.ceil($("div#recruitment-publish-text textarea").val().replace(/[^\x00-\xff]/g, "**").length / 2)) + "个字");
    }
    else {
        $("div#recruitment-publish-remain").html("已超出" + (Math.ceil($("div#recruitment-publish-text textarea").val().replace(/[^\x00-\xff]/g, "**").length / 2 - 140)) + "个字");
    }
}
function ShowJobsPublish() {

    CoverResize();
    $("div#cover").fadeIn(200);
    $("body").css("overflow", "hidden");
    $("div#jobs-publish").fadeIn(200);
    $("div#jobs-publish-text textarea").focus();
    $("div#jobs-publish-text textarea").val($("div#jobs-publish-text textarea").val());
//    $("div#jobs-publish-text textarea").val("??");
}
function HideJobsPublish() {
    $("div#cover").fadeOut(200);
    $("body").css("overflow", "auto");
    $("div#jobs-publish").fadeOut(200);
}
function ShowRecruitmentPublish() {
    CoverResize();
    $("div#cover").fadeIn(200);
    $("body").css("overflow", "hidden");
    $("div#recruitment-publish").fadeIn(200);
    $("div#recruitment-publish-text textarea").focus();
    $("div#recruitment-publish-text textarea").val($("div#recruitment-publish-text textarea").val());
}
function HideRecruitmentPublish() {
    $("div#cover").fadeOut(200);
    $("body").css("overflow", "auto");
    $("div#recruitment-publish").fadeOut(200);
}

