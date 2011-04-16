<?php
include_once('common.inc.php');

func_register(array(
    'cate' => array(
        'callback' => 'theme_cat',
    ),
));

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
    elseif (!function_exists($function))
        return "<p>Error: theme function <b>$function</b> not found.</p>";
    return call_user_func_array($function, $args);
}

function theme_template($template)
{
    $page = file_get_contents($template);
    #FIXME: Should use flexible theme functions here
    echo $page;
}

function theme_external_link($url, $content = null)
{
    if (!$content) 
    {    
        return "<a class='item-blog-link' href='".long_url($url)."' target='_blank'>".$url."</a>";
    }
    else
    {
        return "<a class='item-blog-link' href='$url' target='_blank'>$content</a>";
    }
}

function parselink($out)
{
    require_once("autolink.inc.php");
    $autolink = new Twitter_Autolink();
    $out = $autolink->autolink($out);
    return $out;
}

function parsekeyword($keyword, $out)
{
    $keyword = explode(" ",$keyword);
    foreach($keyword as $key)
        if($key and $key !== "all")
        {
            #$out = preg_replace('/(>.*?)('.$key.')(.*?<)/i', '${1}<span class=\'highlight\'>${2}</span>${3}', $out);
            $out = preg_replace('/('.$key.')/i', '<span class=\'highlight\'>${1}</span>', $out);
            $out = preg_replace('$href=\\"([^<]*)<span[^>]+>([^<]+)</span>([^\\"]*)\\"$i',
                'href="${1}${2}${3}"', $out);
            $out = preg_replace('$title=\\"([^<]*)<span[^>]+>([^<]+)</span>([^\\"]*)\\"$i',
                'title="${1}${2}${3}"', $out);
            $out = preg_replace('$class=\\"([^<]*)<span[^>]+>([^<]+)</span>([^\\"]*)\\"$i',
                'title="${1}${2}${3}"', $out);
        }
    return $out;
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
    $i = 0;
    foreach($result as $r)
    {
        if($i%2==0)
            $pre = " sorts-item-alternative";
        else
            $pre = "";
        $content .= '<div class="sorts-item'.$pre.'">
                <a id='.$i++.'>'.$r['name'].'</a></div>';
    }
    echo $content;
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

function time_tran($the_time){
    $now_time = date("Y-m-d H:i:s",time());
    $now_time = strtotime($now_time);
    $show_time = strtotime($the_time);
    $dur = $now_time - $show_time;
    if($dur < 0)
        return $the_time;
    elseif($dur < 60)
        return $dur.'秒前';
    elseif($dur < 3600)
        return floor($dur/60).'分钟前';
    elseif($dur < 86400)
        return floor($dur/3600).'小时前';
    elseif($dur < 259200)        //3天内
        return floor($dur/86400).'天前';
    else
        return $the_time;
}

function theme_result($result, $keyword = '', $admin = false)
{
    include_once("login.inc.php");
    include_once("hot.inc.php");
    if(user_is_authenticated())
    {
        include_once("like.inc.php");
        $allfav = get_likes(32767, "");
        include_once("apply_sent.inc.php");
        $allapp = get_sent_applies(32767, "");
    }
    $content = "";
    foreach($result as $r)
    {
        if($keyword)
            $jg = parsekeyword($keyword, parselink($r['content']));
            #$jg = parselink(parsekeyword($keyword, $r['content']));
        else
            $jg = parselink($r['content']);
        $tags = get_tags($r['tweet_id']);
        if(strstr($r['source'], '<'))
            $source = str_replace("<a ", '<a target="_blank" class="left microblog-item-position"', $r['source']);
        else
            $source = '<a class="left microblog-item-position" target="_blank">'.$r['source'].'</a>';
        
        $content .= '<div class="microblog-item" id="'.strtotime($r['post_datetime']).'">
                    <div class="left microblog-item-pic">
                        <a target="_blank" href="'.BASE_URL.'profile/'.$r['post_screenname'].'"><img alt="" width="50" height="50" src="'.$r['profile_image_url'].'"/></a>
                    </div>
                    <div class="left microblog-item-content">
                        <div class="microblog-item-blog">
                            <a class="microblog-item-blog-name" target="_blank" href="'.BASE_URL.'profile/'.$r['post_screenname'].'">'
                            .$r['post_screenname'].'</a>：'.$jg.'
                        </div>
                        <div class="microblog-item-other">
                            <a target="_blank" href="http://api.t.sina.com.cn/'.$r['user_site_id'].'/statuses/'.$r['tweet_site_id'].'" class="left microblog-item-time">'.time_tran($r['post_datetime']).'</a> '.$source;
        if($admin)
            $content .= '<a class="right item-control last delete" onclick="DeleteTweet(\''.$r['tweet_id'].'\', this)">删除</a>';
        else
        {
            if(user_is_authenticated())
            {
                $fav = 0;
                $app = 0;
                foreach($allfav as $f)
                    if($f['tweet_id'] == $r['tweet_id'])
                    {
                        $fav = 1;
                        break;
                    }
                foreach($allapp as $f)
                    if($f['tweet_id'] == $r['tweet_id'])
                    {
                        $app = 1;
                        break;
                    }
                if(!$fav)
                    $content .= '<a class="right microblog-item-control like" onclick="JobLike(this,\''.$r['tweet_id'].'\')">收藏</a><a class="right microblog-item-control unlike"
                                            style="display: none;" onclick="JobUnLike(this,\''.$r['tweet_id'].'\')">取消收藏</a> ';
                else
                    $content .= '<a class="right microblog-item-control like" style="display: none;" onclick="JobLike(this,\''.$r['tweet_id'].'\')">收藏</a><a class="right microblog-item-control unlike"
                                             onclick="JobUnLike(this,\''.$r['tweet_id'].'\')">取消收藏</a> ';
                $role = get_current_user_role();
                if($role == 1)
                {
                    if($r['type'] != 1 and !$app)
                    $content .= '<a class="right microblog-item-control microblog-item-apply apply" onclick="JobApply(this,\''.$r['tweet_id'].'\',\''.$r['post_screenname'].'\')">
                                 申请该职位</a><a class="right microblog-item-control microblog-item-apply unapply" style="display: none;" onclick="JobUnApply(this,\''.$r['tweet_id'].'\')">
                                 取消申请</a>';
                    elseif($app)
                    $content .= '<a class="right microblog-item-control microblog-item-apply apply" style="display: none;" onclick="JobApply(this,\''.$r['tweet_id'].'\',\''.$r['post_screenname'].'\')">
                                 申请该职位</a><a class="right microblog-item-control microblog-item-apply unapply" onclick="JobUnApply(this,\''.$r['tweet_id'].'\')">
                                 取消申请</a>';
                }
            }
            if($tags)
            {
                $content.='</div><div class="microblog-item-other1">
                                <span class="left microblog-item-relate">相关职位：</span> ';
                foreach($tags as $t)
                    $content.='<a class="left keyword microblog-item-relate" onclick="SearchContent(false, \''.$t.'\', 0, 0)">'.$t.'</a>';
            }
        }
        $content .= '
                        </div>
                    </div>
                </div>';
    }
    return $content;
}

function theme_rss($result)
{
    header('Content-Type: application/xml; charset=utf-8');
    $content = '<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0">
  <channel>
    <title>'.$GLOBALS['search'].'最新职位订阅-歪伯乐</title>
    <link>'.BASE_URL.'search/'.$GLOBALS['search'].'</link>
    <description>Latest 10 threads of all jobs</description>
    <copyright>Copyright(C) 歪伯乐</copyright>
    <generator>YBole by GNG.</generator>
    <lastBuildDate>'.date(DATE_RSS).'</lastBuildDate>
    <ttl>30</ttl>
    <image>
      <url>'.BASE_URL.'images/logo.gif</url>
      <title>'.$GLOBALS['search'].'最新职位订阅-歪伯乐</title>
      <link>'.BASE_URL.'search/'.$GLOBALS['search'].'</link>
    </image>';
    foreach($result as $r)
    $content .= '<item>
      <title>'.$r['post_screenname'].":".mb_substr($r['content'], 0, 15, "utf8").'...</title>
      <link>http://api.t.sina.com.cn/'.$r['user_site_id'].'/statuses/'.$r['tweet_site_id'].'</link>
      <description><![CDATA['.$r['content'].']]></description>
      <pubDate>'.date(DATE_RSS, strtotime($r['post_datetime'])).'</pubDate>
    </item>';
    $content .= '
  </channel>
</rss>';
echo $content;
}
?>
