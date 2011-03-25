<?php

$current_theme = false;

function theme()
{
    global $current_theme;
    $args = func_get_args();
    $function = array_shift($args);
    $function = 'theme_'.$function;
  
    if ($current_theme) {
        $custom_function = $current_theme.'_'.$function;
        if (function_exists($custom_function))
            $function = $custom_function;
    }
    else
    {
        if (!function_exists($function))
            return "<p>Error: theme function <b>$function</b> not found.</p>";
    }
    return call_user_func_array($function, $args);
}

function theme_page($title, $content) {
    ob_start('ob_gzhandler');
    header('Content-Type: text/html; charset=utf-8');
    echo '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>'.$title.' - 微招聘</title>
    <link href="'.BASE_URL.'css/share.css" rel="stylesheet" type="text/css" />
    <link href="'.BASE_URL.'css/default.css" rel="stylesheet" type="text/css" />
    <script src="'.BASE_URL.'script/jquery-1.5.1.js" type="text/javascript"></script>
    <script src="'.BASE_URL.'script/ui/jquery.ui.position.js" type="text/javascript"></script>
    <script src="'.BASE_URL.'script/share.js" type="text/javascript"></script>
    <script src="'.BASE_URL.'script/default.js" type="text/javascript"></script>
    <script type="text/javascript">
        var MR = false;
        var ML = false;
        var length = 0;
        var position = 0;

        $(function () {
            $("#concern-pic").animate({ opacity: 0.6 }, 0);
            $("#concern-pic").mouseover(function () {
                $(this).animate({ opacity: 1 }, 200);
            });
            $("#concern-pic").mouseout(function () {
                $(this).animate({ opacity: 0.6 }, 200);
            });
            $("#history-pic").animate({ opacity: 0.6 }, 0);
            $("#history-pic").mouseover(function () {
                $(this).animate({ opacity: 1 }, 200);
            });
            $("#history-pic").mouseout(function () {
                $(this).animate({ opacity: 0.6 }, 200);
            });

            $(".concern-item").mouseover(function () {
                $(this).addClass("concern-item-over");
            });
            $(".concern-item").mouseout(function () {
                $(this).removeClass("concern-item-over");
            });
            $(".history-item").mouseover(function () { $(this).addClass("history-item-over"); });
            $(".history-item").mouseout(function () { $(this).removeClass("history-item-over"); });

            $(".concern-item-delete").click(function () {
                $(this).parent().animate({ opacity: 0 }, 200, function () { $(this).slideUp(100); });
            });
            $(".concern-item-content").click(function () {
                $(this).children(".concern-item-content-number").fadeOut(200, function () { $(this).parent().removeClass("concern-item-content-new"); });
            });

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
        });
    </script>
</head>
<body>
    <div id="header">
        <div class="left" id="links">
            <a class="left">微博招聘网</a> <a class="left">微博招聘官方微博</a> <a class="left last">我的微博</a>
        </div>
        <div class="right" id="infos">'.theme("login").'</div>
    </div>
    <div id="logo-search">
        <a id="logo" class="left" href="'.BASE_URL.'"></a>
        <div id="search-bar" class="left">
            <form action="'.BASE_URL.'search" method="POST">
            <a class="left sort" id="sort">全部分类</a><a class="left sort" id="sort-triangle">6</a>
            <input class="left" id="search-text" type="text" value="产品 北京" />
            <input type="submit"><a class="left" id="search-button"></a></input>
            </form>
        </div>
    </div>
    <div id="company" class="inner">
        <div class="clear">
        </div>
        <span class="left company-name">热门企业：</span>
        <div class="left" id="companies">
            <div id="companies-inner">
                <a class="company-name">百度</a><a class="company-name">阿里巴巴</a><a class="company-name">
                    百度</a><a class="company-name">阿里巴巴</a><a class="company-name">百度</a><a class="company-name">
                        阿里巴巴</a><a class="company-name">百度</a><a class="company-name">阿里巴巴</a><a class="company-name">
                            百度</a><a class="company-name">微软亚洲研究院</a><a class="company-name">微软亚洲研究院</a>
                <a class="company-name">微软亚洲研究院</a><a class="company-name">微软亚洲研究院</a><a class="company-name">微软亚洲研究院</a><a
                    class="company-name last">百度</a></div>
        </div>
        <div class="left" id="company-control">
            <a class="left company-control" id="company-control-left">◀</a> <a class="left company-control"
                id="company-control-right">▶</a>
        </div>
    </div>
    <div id="content" class="inner">
        <div id="left" class="left">'.theme('left').'</div>
        <div id="right" class="left">'.$content.'</div>
        </div>
    </div>
    <div id="sorts">
        <div id="sorts-tag">
            <a id="sorts-name">全部分类</a><a id="sorts-triangle">6</a>
        </div>
        <div id="sorts-content">'.theme('cat').'</div>
    </div>'.theme('google_analytics').'
</body>
</html>';
    exit();
}

function theme_cat()
{
    include_once("common.inc.php");
    $content = "";
    $result = get_categories();
    foreach($result as $r)
    {
        $content .= '<div class="sorts-item sorts-item-alternative">
                <a>'.$r['name'].'</a></div>';
    }
    return $content;
}

function theme_follow()
{
    include_once("follow.inc.php");
    $content = '<div id="concern">
                <div class="left-title">
                    <span class="left-title-text left">我的关注</span><a class="right left-title-pic" id="concern-pic"></a></div>';
    $follows = get_followings();
    foreach($follows as $f)
        $content .= '<div class="concern-item concern-item-normal">
                    <a class="concern-item-delete left" href="'.BASE_URL.'follow/delete/'.$f['following_id'].'"></a>
                    <div class="left concern-item-content">
                        <a class="left concern-item-content-info">'.$f['search'].'</a> <a class="right concern-item-content-number">
                            </a>
                    </div>';
    $content .= '</div>';
    return $content;
}

function theme_history()
{
    include_once("search.inc.php");
    $content = '<div id="history">
                <div class="left-title">
                    <span class="left left-title-text">搜索历史</span> <a class="right left-title-pic" id="history-pic">
                    </a>
                </div>
                <div class="history-item">
                    <a>北京 淘宝 百度 web前端开发 php工程师</a></div>
                <div class="history-item">
                    <a>杭州 阿里巴巴 web前端开发 产品设计</a></div>
            </div>';
    return $content;
}

function theme_hot()
{
    include_once("common.inc.php");
    $content = '<div id="hot">
                <div class="left-title">
                    <span class="left left-title-text">热门职位</span> <span class="right left-title-time">截止至2011.3.11</span>
                </div>
                <div id="hot-content">
                    <a class="left hot-content-item">产品设计师(2379)</a> <a class="left hot-content-item">销售经理(1187)</a>
                    <a class="left hot-content-item">网络编辑(1082)</a> <a class="left hot-content-item">营销经理(1187)</a>
                    <a class="left hot-content-item">开发工程师(1082)</a> <a class="left hot-content-item">php工程师(1187)</a>
                    <a class="left hot-content-item">网络编辑(1082)</a> <a class="left hot-content-item">java工程师(1187)</a>
                    <a class="left hot-content-item">平面设计师(1082)</a> <a class="left hot-content-item">销售经理(1187)</a>
                    <a class="left hot-content-item">网络编辑(1082)</a>
                </div>
            </div>';
    return $content;
}

function theme_left()
{
    include_once("login.inc.php");
    $content = "";
    if(user_is_authenticated())
    {
        $content .= theme("follow");
        $content .= theme("history");
    }
    $content .= theme("hot");
    return $content;
}

function theme_google_analytics()
{
    global $GA_ACCOUNT;
    if (!$GA_ACCOUNT) return '';
    $googleAnalyticsImageUrl = googleAnalyticsGetImageUrl();
    return "<img src='{$googleAnalyticsImageUrl}' />";
}

function theme_login()
{  
    include_once("login.inc.php");
    $content = "";
    if(user_is_authenticated())
        $content .= '<a class="left selected logined" id="name">'.$GLOBALS['user']['nickname'].'</a> <a class="left orange logined">
                信息管理</a> <a class="left logined" id="publish">发布求职信息</a> <a class="left logined" href="'.BASE_URL.'logout">退出</a>';
    else
        $content .= '<a class="left logouted" id="sina-login" href="'.BASE_URL.'sina_login"></a>';
    return $content;
}

function theme_result($result)
{
    $content = "";
    foreach($result as $r)
    {
        if(strstr($r, '<'))
            $source = str_replace("<a ", '<a class="left microblog-item-position"', $r['source']);
        else
            $source = '<a class="left microblog-item-position">'.$r['source'].'</a>';
        
        $content .= '<div class="microblog-item">
                    <div class="left microblog-item-pic">
                        <img alt="" width="50" height="50" src="'.$r['profile_image_url'].'"/>
                    </div>
                    <div class="left microblog-item-content">
                        <div class="microblog-item-blog">
                            <a class="microblog-item-blog-name" target="_blank" href="http://t.sina.com.cn/n/'.$r['post_screenname'].'">'.$r['post_screenname'].'</a>：'.$r['content'].'
                        </div>
                        <div class="microblog-item-other">
                            <span class="left microblog-item-time">'.$r['post_datetime'].'</span> '.$source;
        include_once("login.inc.php");
        if(user_is_authenticated())
            $content .= '<a class="right microblog-item-control">收藏</a> <a class="right microblog-item-control microblog-item-apply">
                                    申请该职位</a>';
        $content .='
                        </div>
                    </div>
                    <div class="clear">
                    </div>
                </div>';
    }
    return $content;
}
?>
