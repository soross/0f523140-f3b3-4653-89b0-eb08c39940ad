var MR = false;
var ML = false;
var position = 0;

$(function () {
    SetCompany();
    //    SetSorts();
});

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
        $(this).stop().animate({ opacity: 1 }, 0);
    });
    $("#company-control-right").mouseout(function () {
        if (MR) {
            MR = false;
        }
        $(this).stop().animate({ opacity: 0.4 }, 0);
    });
    $("#company-control-left").mouseover(function () {
        if (!ML) {
            ML = true;
            CompanyML();
        }
        $(this).stop().animate({ opacity: 1 }, 0);
    });
    $("#company-control-left").mouseout(function () {
        if (ML) {
            ML = false;
        }
        $(this).stop().animate({ opacity: 0.4 }, 0);
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
    $("div#sorts").css("top", "78px");
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
                cate = $(this).attr("id");
            });
        }
    });
    $("#sorts-name").click(function () { $("#sorts").fadeOut(200) });
    $("#sorts-triangle").click(function () { $("#sorts").fadeOut(200) });
    $("#sort-triangle").click(function () { $("#sorts").fadeIn(200) });
    $("#sort").click(function () { $("#sorts").fadeIn(200) });
    $("body").click(function (e) {
        if (e.pageX >= $("#sorts").offset().left && e.pageX <= $("#sorts").offset().left + $("#sorts").width() && e.pageY >= $("#sorts").offset().top && e.pageY <= $("#sorts").offset().top + $("#sorts").height()) {
        }
        else {
            $("#sorts").fadeOut(200);
        }
    });
}