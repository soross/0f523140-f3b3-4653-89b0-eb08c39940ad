<?php
func_register(array(
    'like' => array(
        'callback' => 'user_like',
        'security' => 'true',
    ),
));

function get_favorites($num)
{
    include_once('login.php');
    $id = get_current_user_id();
    connect_db();
    $view = "SELECT tweets.* from tweets, (SELECT * FROM favorites WHERE user_id='$id' AND deleted=0) as favorites WHERE tweets.tweet_id=favorites.tweet_id ORDER BY tweets.post_datetime DESC";
    $list = mysql_query($view);
    $result = array();
    $i = 0;
    while($row = mysql_fetch_array($list))
    {
        $result[$i++] = $row;
        if($i == $num)
            break;
    }
    return $result;
}

function favorites_show()
{
    $args = func_get_args();
    $key = intval($args[2]);
    $content = '<div id="content-middle-delete">
                   <a class="right">删除全部</a>
               </div>';
    $favorites = get_favorites($key);
    foreach($favorites as $f)
        $content .= '<div class="item" id="'.$f['tweet_id'].'">
                   <div class="item-delete">
                       <a class="right"></a>
                   </div>
                   <div class="left item-pic">
                       <img src="'.$f['profile_image_url'].'" alt="" width="50" height="50" />
                   </div>
                   <div class="left item-content">
                       <div class="item-blog">
                           <a class="item-blog-name">'.$f['post_screenname'].'</a>：'.$f['content'].'
                       </div>
                       <div class="item-other">
                           <span class="left item-time">'.$r['post_datetime'].'</span> '.$source.'
                           <a class="right item-control">评论</a> <a class="right item-control">收藏(1)</a> <a class="right item-control">
                               转发(2)</a> <a class="right item-control last">删除</a> <span class="right item-apply item-apply-info">
                                   未读</span> <span class="right item-apply item-apply-name">状态：</span> <span class="right item-apply item-apply-info">
                                       2小时前</span> <span class="right item-apply item-apply-name">申请于：</span>
                           <a class="right item-favourite item-action">取消收藏</a> <a class="right item-favourite item-doapply">
                               申请该职位</a>
                       </div>
                   </div>
                   <div class="clear">
                   </div>
               </div>';
    echo $content;
}

function favorites_delete()
{
    include_once('login.php');
    $id = get_current_user_id();
    $args = func_get_args();
    $key = $args[2];
    if(!$key)
        die('Invalid Argument!');
    connect_db();
    $view = "SELECT * FROM favorites WHERE user_id='$id' AND tweet_id='$key' AND deleted='0'";
    $list = mysql_query($view);
    $row = mysql_fetch_array($list);
    if($row)
    {
        $view = "UPDATE favorites SET deleted='1' WHERE user_id='$id' AND tweet_id='$key'";
        $list = mysql_query($view) or die("Delete error!");
    }
    else
    {
        print $key;
        die(": Non-exist Error!");
    }
}

function favorites_exist()
{
    include_once('login.php');
    $id = get_current_user_id();
    $args = func_get_args();
    $key = $args[2];
    if(!$key)
        die('Invalid Argument!');
    connect_db();
    $view = "SELECT * FROM favorites WHERE user_id='$id' AND tweet_id='$key' AND deleted='0'";
    $list = mysql_query($view);
    $row = mysql_fetch_array($list);
    if($row)
        echo "1";
    else
        echo "0";
}

function favorites_add()
{
    include_once('login.php');
    $id = get_current_user_id();
    $args = func_get_args();
    $key = $args[2];
    if(!$key)
        die('Invalid Argument!');
    connect_db();
    $view = "SELECT * FROM favorites WHERE user_id='$id' AND tweet_id='$key' AND deleted='0'";
    $list = mysql_query($view);
    $row = mysql_fetch_array($list);
    if($row)
    {
        favorites_delete("", "", $key);
    }
    $view = "INSERT INTO favorites(tweet_id, user_id, deleted) VALUES ('$key', '$id', '0')";
    $list = mysql_query($view) or die("Insert error!");
}

function theme_like($content)
{
    theme('page', "收藏", $content);
}

function user_like($query)
{
    $key = (string) $query[1];
    if(!$key)
        $key = "show";
    $function = 'favorites_'.$key;
    if (!function_exists($function))
        die("Invalid Argument!");
    return call_user_func_array($function, $query);
}
?>
