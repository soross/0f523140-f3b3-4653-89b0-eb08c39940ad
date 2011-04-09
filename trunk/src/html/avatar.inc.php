<?php
func_register(array(
  'avatar' => array(
    'callback' => 'deal_avatar',
    'security' => 'true',
  ),
));

function avatar_show()
{
    include_once("login.inc.php");
    $id = get_current_user_id();
    connect_db();
    $view = "SELECT avatar_url FROM userinfo WHERE user_id='$id'";
    $list = mysql_query($view);
    $row = mysql_fetch_array($list);
    if($row)
        if($row[0])
        {
            echo $row[0];
            return;
        }
    
    $me = sina_get_credentials();
    $avatar = $me['profile_image_url'];
    $view = "UPDATE userinfo SET avatar_url='".$avatar."' WHERE user_id='$id'";
    $list = mysql_query($view);
    echo $avatar;
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
