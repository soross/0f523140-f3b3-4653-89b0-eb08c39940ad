<?php
include_once('common.inc.php');

func_register(array(
    'tweet' => array(
        'callback' => 'deal_tweet',
        'security' => 'true',
    ),
));

function tweet_post()
{
    $args = func_get_args();
    $cate = $args[2];
    $content = get_post('text');
    if(!$cate or !$content)
        die("Invalid argument!");
    include_once('sinaoauth.inc.php');
    $c = new WeiboClient(SINA_AKEY, SINA_SKEY, $GLOBALS['user']['sinakey']['oauth_token'], $GLOBALS['user']['sinakey']['oauth_token_secret']);
    if($_FILES['upload']['tmp_name'])
        $msg = $c -> upload($content, $_FILES['upload']['tmp_name']);
    else
        $msg = $c -> update($content);
    if ($msg === false || $msg === null){
        echo "Error occured";
        return false;
    }
    
    if (isset($msg['error_code']) && isset($msg['error'])){
        echo ('Error_code: '.$msg['error_code'].';  Error: '.$msg['error'] );
        return false;
    }
    include_once("uuid.inc.php");
    $v4uuid = str_replace("-", "", UUID::v4());
    connect_db();
    $add = "INSERT INTO pending_tweets (
                     site_id, tweet_id, user_site_id, content, post_datetime,
                     type, tweet_site_id,
                     post_screenname, profile_image_url, source)
                     VALUES (1, '$v4uuid', '".$msg['user']['id']."', '$content', '".date("Y-m-d H:i:s" ,strtotime($msg["created_at"]))."',
                     $cate, '".$msg['id']."', '".$msg["user"]["name"]."', '".$msg["user"]["profile_image_url"]."', '".$msg["source"]."')";
    if($msg['thumbnail_pic'])
        $add = "INSERT INTO pending_tweets (
                     site_id, tweet_id, user_site_id, content, post_datetime,
                     type, tweet_site_id,
                     post_screenname, profile_image_url, source, thumbnail)
                     VALUES (1, '$v4uuid', '".$msg['user']['id']."', '$content', '".date("Y-m-d H:i:s" ,strtotime($msg["created_at"]))."',
                     $cate, '".$msg['id']."', '".$msg["user"]["name"]."', '".$msg["user"]["profile_image_url"]."', '".$msg["source"]."', '".$msg['thumbnail_pic']."')";
    
    $added = mysql_query($add) or die("Could not add entry!");
    echo "0";
}

function tweet_delete()
{
    include_once('login.php');
    include_once('sinaoauth.inc.php');
    $id = get_current_user_id();
    $args = func_get_args();
    $key = $args[2];
    if(!$key)
        die('Invalid Argument!');
    connect_db();
    $view = "SELECT tweets.* FROM tweets, (SELECT user_id, user_site_id, site_id FROM accountbindings) AS ac WHERE tweets.user_site_id = ac.user_site_id AND ac.user_id='$id' AND ac.site_id = tweets.site_id AND tweets.tweet_id='$key' AND tweets.deleted='0'";
    $list = mysql_query($view);
    $row = mysql_fetch_array($list);
    if($row or user_is_admin())
    {
        if($row)
        {
            $c = new WeiboClient(SINA_AKEY, SINA_SKEY, $GLOBALS['user']['sinakey']['oauth_token'], $GLOBALS['user']['sinakey']['oauth_token_secret']);
            $msg = $c -> destroy($row['tweet_site_id']);
        }
        $view = "UPDATE tweets SET deleted='1' WHERE tweet_id='$key'";
        $list = mysql_query($view) or die("Delete error!");
    }
    else
    {
        print $key;
        die(": Non-exist Error!");
    }
}

function deal_tweet($query)
{
    $key = (string) $query[1];
    if(!$key)
        $key = "show";
    $function = 'tweet_'.$key;
    if (!function_exists($function))
        die("Invalid Argument!");
    return call_user_func_array($function, $query);
}
?>
