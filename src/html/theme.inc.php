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
    echo $content;
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
    $content = '<div class="left-title">
                    <span class="left-title-text left">我的关注</span><a class="right left-title-pic" id="concern-pic"></a></div>';
    $follows = get_followings();
    foreach($follows as $f)
        $content .= '<div class="concern-item concern-item-normal">
                    <a class="concern-item-delete left"></a>
                    <div class="left concern-item-content">
                        <a class="left concern-item-content-info">'.$f['search'].'</a> <a class="right concern-item-content-number">
                            </a>
                    </div></div>';
    echo $content;
}

function theme_history()
{
    include_once("search.inc.php");
    $content = '<div class="left-title">
                    <span class="left left-title-text">搜索历史</span> <a class="right left-title-pic" id="history-pic" href="'.BASE_URL.'history/deleteall">
                    </a>
                </div>';
    $history = get_search_history();
    foreach($history as $h)
        $content .= '<div class="history-item">
                    <a href="'.BASE_URL.'search/'.$h['search'].'">'.$h['search'].'</a></div>';
    $content .= '</div>';
    echo $content;
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
        
        $content .= '<div class="microblog-item" id="'.strtotime($r['post_datetime']).'">
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
    <generator>DiggJob by GNG.</generator>
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
