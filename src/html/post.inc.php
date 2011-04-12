<?php
func_register(array(
    'post' => array(
        'callback' => 'post_tweet',
        'security' => 'true',
    ),
));

function post_tweet($query)
{
    $cate = (string) $query[1];
    $content = $_POST['text'];
    if(!$cate or !$content)
        die("Invalid argument!");
    include_once('sinaoauth.php');
    $c = new WeiboClient(SINA_AKEY, SINA_SKEY, $GLOBALS['user']['sinakey']['oauth_token'], $GLOBALS['user']['sinakey']['oauth_token_secret']);
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
    $added = mysql_query($add) or die("Could not add entry!");
    echo "0";
}
?>
