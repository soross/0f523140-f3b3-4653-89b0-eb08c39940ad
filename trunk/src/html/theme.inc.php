<?php

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
    else
    {
        if (!function_exists($function))
            return "<p>Error: theme function <b>$function</b> not found.</p>";
    }
    return call_user_func_array($function, $args);
}

function long_url($shortURL)
{
	if (!defined('LONGURL_KEY'))
	{
		return $shortURL;
	}
	$url = "http://www.longurlplease.com/api/v1.1?q=" . $shortURL;
	$curl_handle=curl_init();
	curl_setopt($curl_handle,CURLOPT_RETURNTRANSFER,1);
	curl_setopt($curl_handle,CURLOPT_URL,$url);
	$url_json = curl_exec($curl_handle);
	curl_close($curl_handle);

	$url_array = json_decode($url_json,true);
	
	$url_long = $url_array["$shortURL"];
	
	if ($url_long == null)
	{
		return $shortURL;
	}

	if (substr($url_long,0,4) !== "http")
	{
		preg_match("/^(http:\/\/)?([^\/]+)/i", $shortURL, $matches);
		$host = $matches[2];
		$url_long="http://".$host."/".$url_long;
	}
		
	return $url_long;
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
        $out = str_replace($key, "<span class='highlight'>$key</span>", $out);
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
   if($dur < 0){
    return $the_time;
   }else{
    if($dur < 60){
     return $dur.'秒前';
    }else{
     if($dur < 3600){
      return floor($dur/60).'分钟前';
     }else{
      if($dur < 86400){
       return floor($dur/3600).'小时前';
      }else{
       if($dur < 259200){//3天内
        return floor($dur/86400).'天前';
       }else{
        return $the_time;
       }
      }
     }
    }
   }
}

function theme_result($result, $keyword = '')
{
    include_once("login.inc.php");
    include_once("tag.inc.php");
    if(user_is_authenticated())
    {
        include_once("favorite.inc.php");
        $allfav = get_favorites(32767, "");
        include_once("apply.inc.php");
        $allapp = get_applies(32767, "");
    }
    $content = "";
    foreach($result as $r)
    {
        if($keyword)
            $jg = parsekeyword($keyword, parselink($r['content']));
        else
            $jg = parselink($r['content']);
        $tags = get_tags($r['tweet_id']);
        if(strstr($r['source'], '<'))
            $source = str_replace("<a ", '<a class="left microblog-item-position"', $r['source']);
        else
            $source = '<a class="left microblog-item-position">'.$r['source'].'</a>';
        
        $content .= '<div class="microblog-item" id="'.strtotime($r['post_datetime']).'" name="'.$r['tweet_id'].'">
                    <div class="left microblog-item-pic">
                        <img alt="" width="50" height="50" src="'.$r['profile_image_url'].'"/>
                    </div>
                    <div class="left microblog-item-content">
                        <div class="microblog-item-blog">
                            <a class="microblog-item-blog-name" target="_blank" href="'.BASE_URL.'profile/'.$r['post_screenname'].'">'
                            .$r['post_screenname'].'</a>：'.$jg.'
                        </div>
                        <div class="microblog-item-other">
                            <span class="left microblog-item-time">'.time_tran($r['post_datetime']).'</span> '.$source;
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
                $content .= '<a class="right microblog-item-control like">收藏</a><a class="right microblog-item-control unlike"
                                        style="display: none;">取消收藏</a> ';
            else
                $content .= '<a class="right microblog-item-control like" style="display: none;">收藏</a><a class="right microblog-item-control unlike"
                                        >取消收藏</a> ';
            if($r['type'] != 1 and !$app)
                $content .= '<a class="right microblog-item-control microblog-item-apply apply">
                             申请该职位</a><a class="right microblog-item-control microblog-item-apply unapply" style="display: none;">
                             取消申请</a>';
            elseif($app)
                $content .= '<a class="right microblog-item-control microblog-item-apply apply" style="display: none;">
                             申请该职位</a><a class="right microblog-item-control microblog-item-apply unapply">
                             取消申请</a>';
        }
        if($tags)
        {
            $content.='</div><div class="microblog-item-other1">
                            <span class="left microblog-item-time">相关职位：</span> ';
            foreach($tags as $t)
                $content.='<a class="left keyword microblog-item-relate">'.$t.'</a>';
        }
        $content .= '
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
    $content = '<?xml version="1.0" encoding="utf-8"?>
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
      <title>'.$r['post_screenname'].":".mb_substr($r['content'], 0, 15, "utf8").'...</title> 
      <link>http://api.t.sina.com.cn/'.$r['user_site_id'].'/statuses/'.$r['tweet_site_id'].'</link> 
      <description><![CDATA['.$r['content'].']]></description>
      <pubDate>'.date(DATE_RSS, strtotime($r['post_datetime'])).'</pubDate> 
    </item>';
    $content .= '</channel> 
</rss>';
    echo $content;
}
?>
