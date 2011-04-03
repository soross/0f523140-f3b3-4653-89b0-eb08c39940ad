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
    $c -> update($content);
    echo "0";
}
?>
