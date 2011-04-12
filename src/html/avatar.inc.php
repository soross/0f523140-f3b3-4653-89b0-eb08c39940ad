<?php
func_register(array(
  'avatar' => array(
    'callback' => 'deal_avatar',
    'security' => 'true',
  ),
));

function resizeavatar($url, $size)
{
    if($size == "big")
        $url = str_replace("/50/","/180/", $url);
    return $url;
}

function get_avatar($id, $size)
{
    connect_db();
    $view = "SELECT avatar_url FROM userinfo WHERE user_id='$id'";
    $list = mysql_query($view);
    $row = mysql_fetch_array($list);
    if($row)
        if($row[0])
            return resizeavatar($row[0], $size);
    $me = sina_get_credentials();
    $avatar = $me['profile_image_url'];
    $view = "UPDATE userinfo SET avatar_url='".$avatar."' WHERE user_id='$id'";
    $list = mysql_query($view);
    return resizeavatar($avatar, $size);
}

function avatar_show()
{
    include_once("login.inc.php");
    $args = func_get_args();
    $id = $args[2];
    if($id == "current")
        $id = get_current_user_id();
    $size = $args[3];
    echo get_avatar($id, $size);
}

function deal_avatar($query)
{
    $key = (string) $query[1];
    if(!$key)
        $key = "show";
    $function = 'avatar_'.$key;
    if (!function_exists($function))
        die("Invalid Argument!");
    return call_user_func_array($function, $query);
}
?>
