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
    <link href="'.BASE_URL.'css/themes/base/jquery.ui.all.css" rel="Stylesheet" type="text/css" />
    <link href="'.BASE_URL.'css/share.css" rel="stylesheet" type="text/css" />
    <link href="'.BASE_URL.'css/default.css" rel="stylesheet" type="text/css" />
    <script src="'.BASE_URL.'script/jquery-1.5.1.js" type="text/javascript"></script>
    <script src="'.BASE_URL.'script/ui/jquery.ui.position.js" type="text/javascript"></script>
    <script src="'.BASE_URL.'script/share.js" type="text/javascript"></script>
    <script src="'.BASE_URL.'script/default.js" type="text/javascript"></script>
    <script type="text/javascript">
        $(function () {
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
            <form name="searchbox" action="'.BASE_URL.'search" method="POST">
            <a class="left sort" id="sort">全部分类</a><a class="left sort" id="sort-triangle">6</a>
            <input class="left" id="search-text" name="search_text" type="text" value="'.$GLOBALS['search'].'" />
            <a class="left" id="search-button" onclick="document.searchbox.submit();"></a>
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
    <div id="sorts" class="absolute">
        <div id="sorts-tag">
            <a id="sorts-name" class="left">全部分类</a><a id="sorts-triangle">6</a>
        </div>
        <div id="sorts-content">'.theme('cat').'</div>
    </div>
    <div id="cover">
    </div>
    <div id="role-choose" class="absolute role-jobs">
        <a id="role-jobs" class="absolute"></a><a id="role-recruitment" class="absolute">
        </a><a id="role-confirm" class="absolute"></a>
    </div>
    <div id="jobs-publish" class="absolute">
        <div id="jobs-publish-title">
            <span class="left">发布求职信息</span> <a class="right"></a>
        </div>
        <div id="jobs-publish-content">
            <div id="jobs-publish-remain">
                还可输入136个字</div>
            <div id="jobs-publish-text">
                <textarea>#求职#</textarea>
            </div>
            <div id="jobs-publish-tags">
                <span id="jobs-publish-tags-title" class="left">职位标签</span>
                <input type="text" class="left" />
                <span id="jobs-publish-tags-ps" class="left">标签之间用逗号隔开</span>
            </div>
            <div id="jobs-publish-tags-hot">
                <span id="jobs-publish-tags-hot-title" class="left">热门标签</span> <a class="left jobs-publish-tags-hot-item"
                    title="产品经理">产品经理</a> <a class="left jobs-publish-tags-hot-item" title=".NET开发工程师">.NET开发工程师</a>
                <a class="left jobs-publish-tags-hot-item" title="UI设计师">UI设计师</a>
            </div>
            <div id="jobs-publish-confirm">
                <a class="right"></a>
            </div>
        </div>
    </div>
    <div id="recruitment-publish" class="absolute">
        <div id="recruitment-publish-title">
            <span class="left">发布招聘信息</span> <a class="right"></a>
        </div>
        <div id="recruitment-publish-content">
            <div id="recruitment-publish-remain">
                还可输入136个字</div>
            <div id="recruitment-publish-text">
                <textarea></textarea>
            </div>
            <div id="recruitment-publish-tags">
                <span id="recruitment-publish-tags-title" class="left">职位标签</span>
                <input type="text" class="left" />
                <span id="recruitment-publish-tags-ps" class="left">标签之间用逗号隔开</span>
            </div>
            <div id="recruitment-publish-tags-hot">
                <span id="recruitment-publish-tags-hot-title" class="left">热门标签</span> <a class="left recruitment-publish-tags-hot-item"
                    title="产品经理">产品经理</a> <a class="left recruitment-publish-tags-hot-item" title=".NET开发工程师">
                        .NET开发工程师</a> <a class="left recruitment-publish-tags-hot-item" title="UI设计师">UI设计师</a>
            </div>
            <div id="recruitment-publish-confirm">
                <a class="right"></a>
            </div>
        </div>
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
                        <a class="left concern-item-content-info" href="'.BASE_URL.'search/'.$f['search'].'">'.$f['search'].'</a> <a class="right concern-item-content-number">
                            </a>
                    </div></div>';
    $content .= '</div>';
    return $content;
}

function theme_history()
{
    include_once("search.inc.php");
    $content = '<div id="history">
                <div class="left-title">
                    <span class="left left-title-text">搜索历史</span> <a class="right left-title-pic" id="history-pic" href="'.BASE_URL.'history/deleteall">
                    </a>
                </div>';
    $history = get_search_history();
    foreach($history as $h)
        $content .= '<div class="history-item">
                    <a href="'.BASE_URL.'search/'.$h['search'].'">'.$h['search'].'</a></div>';
    $content .= '</div>';
    return $content;
}

function theme_hot()
{
    include_once("common.inc.php");
    $content = '<div id="hot">
                <div class="left-title">
                    <span class="left left-title-text">热门职位</span> <span class="right left-title-time">截止至'.date('Y.n.j').'</span>
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
                信息管理</a> <a class="left logined jobs" id="jobs-publish-quick">发布求职信息</a><a class="left logined recruitment"
                    id="recruitment-publish-quick">发布应聘信息</a> <a class="left logined" href="'.BASE_URL.'logout">退出</a>';
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

function theme_rss($result)
{
    header('Content-Type: application/xml; charset=utf-8');
    $content = '<?xml version="1.0" encoding="gbk"?>
<rss version="2.0">
  <channel>
    <title>'.$GLOBALS['search'].'最新职位订阅-微招聘</title>
    <link>'.BASE_URL.'search/'.$GLOBALS['search'].'</link> 
    <description>Latest 10 threads of all jobs</description>
    <copyright>Copyright(C) 微招聘</copyright> 
    <generator>Tbole by GNG.</generator>
    <lastBuildDate>'.date(DATE_RSS).'</lastBuildDate> 
    <ttl>30</ttl>
    <image> 
      <url>'.BASE_URL.'images/logo.gif</url> 
      <title>'.$GLOBALS['search'].'最新职位订阅-微招聘</title> 
      <link>'.BASE_URL.'search/'.$GLOBALS['search'].'</link> 
    </image>';
    foreach($result as $r)
        $content .= '<item> 
      <title>'.$GLOBALS['search'].'</title> 
      <link>http://api.t.sina.com.cn/'.$r['user_site_id'].'/statuses/'.$r['tweet_site_id'].'</link> 
      <description><![CDATA['.$r['content'].']]></description> 
      <pubDate>'.date(DATE_RSS, strtotime($r['post_datetime'])).'</pubDate> 
    </item>';
    $content .= '</channel> 
</rss>';
    echo $content;
}
?>
