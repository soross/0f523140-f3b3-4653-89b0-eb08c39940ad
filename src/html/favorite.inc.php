<?php
func_register(array(
    'like' => array(
        'callback' => 'user_like',
        'security' => 'true',
    ),
));

function favorites_count()
{
    include_once('login.inc.php');
    $id = get_current_user_id();
    connect_db();
    $view = "SELECT COUNT(*) FROM favorites WHERE user_id='$id' AND deleted = 0";
    $list = mysql_query($view);
    $row = mysql_fetch_array($list);
    echo $row[0];
}

function get_favorites($num, $page)
{
    include_once('login.inc.php');
    $id = get_current_user_id();
    if(!$page)
        $page = "0";
    $page = intval($page) * $num;
    $limit = " LIMIT $page , $num";
    connect_db();
    $view = "SELECT tweets.* from tweets, (SELECT * FROM favorites WHERE user_id='$id' AND deleted=0) as favorites WHERE tweets.tweet_id=favorites.tweet_id ORDER BY tweets.post_datetime DESC$limit";
    $list = mysql_query($view);
    $result = array();
    $i = 0;
    while($row = mysql_fetch_array($list))
        $result[$i++] = $row;
    return $result;
}

function favorites_show()
{
    $args = func_get_args();
    if($args[2])
        $page = intval($args[2]);
    else
        $page = "";
    $content = '';
    $favorites = get_favorites(10, $page);
    foreach($favorites as $f)
    {
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
                           <span class="left item-time">'.$f['post_datetime'].'</span> '.$source.'
                           <a class="right item-favourite item-action delete">取消收藏</a> ';
                            if($f['type'] != 1)
                                $content .= '<a class="right item-favourite item-doapply apply">
                                        申请该职位</a>';
        $content .= '
                       </div>
                   </div>
                   <div class="clear">
                   </div>
               </div>';
    }
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
