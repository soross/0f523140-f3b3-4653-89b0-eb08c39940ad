<?php
func_register(array(
    'follow' => array(
        'callback' => 'deal_following',
        'security' => 'true',
    ),
));

function get_followings($num)
{
    include_once('login.inc.php');
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
    $content = '';
    $follows = get_followings($key);
    foreach($follows as $f)
        $content .= '<div class="concern-item concern-item-normal" onmouseover="ConcernMouseOver(this)"
                    onmouseout="ConcernMouseOut(this)">
                    <a class="concern-item-delete left" onclick="ConcernDeleteClick('.$f['following_id'].')"></a>
                    <div class="left concern-item-content" onclick="ConcernContentClick(\''.$f['search'].'\')">
                        <a class="left concern-item-content-info">'.$f['cat_id'].':'.$f['search'].'</a> <a class="right concern-item-content-number">
                        </a>
                    </div>
                </div>';
    echo $content;
}

function following_delete()
{
    include_once('login.inc.php');
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
}

function following_exist()
{
    include_once('login.php');
    $id = get_current_user_id();
    $args = func_get_args();
    $cat = $args[2];
    $key = $_POST['search'];
    if(!$key)
        die('Invalid Argument!');
    connect_db();
    $view = "SELECT * FROM followings WHERE cat_id='$cat' AND user_id='$id' AND search='$key' AND deleted='0'";
    $list = mysql_query($view);
    $row = mysql_fetch_array($list);
    if($row)
        echo "1";
    else
        echo "0";
}

function following_add()
{
    include_once('login.php');
    $id = get_current_user_id();
    $args = func_get_args();
    $cat = $args[2];
    $key = $_POST['search'];
    if(!$key)
        die('Invalid Argument!');
    connect_db();
    $view = "SELECT COUNT(*) FROM followings WHERE user_id='$id' AND deleted='0'";
    $list = mysql_query($view);
    $row = mysql_fetch_array($list);
    if($row[0] >= 20)
    {
        die('Too many followings!');
    }
    $view = "SELECT * FROM followings WHERE cat_id='$cat' AND user_id='$id' AND search='$key' AND deleted='0'";
    $list = mysql_query($view);
    $row = mysql_fetch_array($list);
    if($row)
    {
        following_delete("", "", $row['following_id']);
    }
    include_once("uuid.inc.php");
    $v4uuid = str_replace("-", "", UUID::v4());
    $current_datetime = date('Y-m-d H:i:s');
    $view = "INSERT INTO followings(following_id, search, user_id, deleted, add_time, cat_id) VALUES ('$v4uuid', '$key', '$id', '0', '$current_datetime', '$cat')";
    $list = mysql_query($view) or die("Insert error!");
}

function deal_following($query)
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
