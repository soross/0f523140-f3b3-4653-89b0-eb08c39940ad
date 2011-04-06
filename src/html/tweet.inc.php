<?php
func_register(array(
    'tweet' => array(
        'callback' => 'deal_tweet',
        'security' => 'true',
    ),
));

function tweet_delete()
{
    include_once('login.php');
    include_once('sinaoauth.php');
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
