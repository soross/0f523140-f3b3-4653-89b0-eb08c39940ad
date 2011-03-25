<?php
func_register(array(
    'follow' => array(
        'callback' => 'following',
        'security' => 'true',
    ),
));

function user_follow($query)
{
    $key = (string) $query[1];
    if(!$key):
        die("Invalid argument!");
    endif;
    $content = '建设中...<br/>关注关键词:'.$key;
    theme('page', "关注", $content);
}

function get_followings($num)
{
    include_once('login.php');
    $id = get_current_user_id();
    connect_db();
    $view = "SELECT * FROM followings WHERE user_id='$id' AND deleted=0 ORDER BY add_time DESC";
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

function following_show()
{
    $args = func_get_args();
    $key = intval($args[2]);
    $data = get_followings($key);
    $content = "";
    foreach($data as $s)
    {
        $content .= $s['search']."<br />";
    }
    theme('page', '我在关注', $content);
}

function following_delete()
{
    include_once('login.php');
    $id = get_current_user_id();
    $args = func_get_args();
    $key = $args[2];
    if(!$key)
        die('Invalid Argument!');
    connect_db();
    $view = "SELECT * FROM followings WHERE user_id='$id' AND following_id='$key' AND deleted='0'";
    $list = mysql_query($view);
    $row = mysql_fetch_array($list);
    if($row)
    {
        $view = "UPDATE followings SET deleted='1' WHERE user_id='$id' AND following_id='$key'";
        $list = mysql_query($view) or die("Delete error!");
    }
    else
    {
        print $key;
        die(": Non-exist Error!");
    }
    header("Location: ".BASE_URL);
}

function following_add()
{
    include_once('login.php');
    $id = get_current_user_id();
    $args = func_get_args();
    $key = $args[2];
    if(!$key)
        die('Invalid Argument!');
    connect_db();
    $view = "SELECT * FROM followings WHERE user_id='$id' AND search='$key' AND deleted='0'";
    $list = mysql_query($view);
    $row = mysql_fetch_array($list);
    if($row)
    {
        following_delete("", "", $row['id']);
    }
    include_once("uuid.inc.php");
    $v4uuid = str_replace("-", "", UUID::v4());
    $current_datetime = date('Y-m-d H:i:s');
    $view = "INSERT INTO followings(following_id, search, user_id, deleted, add_time) VALUES ('$v4uuid', '$key', '$id', '0', '$current_datetime')";
    $list = mysql_query($view) or die($view."Insert error!");
    header("Location: ".BASE_URL);
}

function following($query)
{
    $key = (string) $query[1];
    if(!$key)
        $key = "show";
    $function = 'following_'.$key;
    if (!function_exists($function))
        die("Invalid Argument!");
    return call_user_func_array($function, $query);
}
?>
