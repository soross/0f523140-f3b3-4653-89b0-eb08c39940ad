<?php
func_register(array(
    'apply' => array(
        'callback' => 'user_apply',
        'security' => 'true',
    ),
));

function apply_count()
{
    include_once('login.inc.php');
    $id = get_current_user_id();
    connect_db();
    $view = "SELECT COUNT(*) from FROM applications WHERE user_id='$id' AND deleted = 0";
    $list = mysql_query($view);
    $row = mysql_fetch_array($list);
    echo $row['COUNT(*)'];
}

function get_applies($num, $page)
{
    include_once('login.inc.php');
    $id = get_current_user_id();
    if(!$page)
        $page = "0";
    $page = intval($page) * $num;
    $limit = " LIMIT $page , $num";
    connect_db();
    $view = "SELECT tweets.* from tweets, (SELECT * FROM applications WHERE user_id='$id' AND deleted=0) as applications WHERE tweets.tweet_id=applications.tweet_id ORDER BY tweets.post_datetime DESC$limit";
    $list = mysql_query($view);
    $result = array();
    $i = 0;
    while($row = mysql_fetch_array($list))
        $result[$i++] = $row;
    return $result;
}

function apply_show()
{
    $args = func_get_args();
    if($args[2])
        $page = intval($args[2]);
    else
        $page = "";
    $content = '';
    $applies = get_applies(10, $page);
    foreach($applies as $f)
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
                           <span class="left item-time">'.$r['post_datetime'].'</span> '.$source.'
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

function apply_delete()
{
    include_once('login.php');
    $id = get_current_user_id();
    $args = func_get_args();
    $key = $args[2];
    if(!$key)
        die('Invalid Argument!');
    connect_db();
    $view = "SELECT * FROM applications WHERE user_id='$id' AND tweet_id='$key' AND deleted='0'";
    $list = mysql_query($view);
    $row = mysql_fetch_array($list);
    if($row)
    {
        $view = "UPDATE applications SET deleted='1' WHERE user_id='$id' AND tweet_id='$key'";
        $list = mysql_query($view) or die("Delete error!");
    }
    else
    {
        print $key;
        die(": Non-exist Error!");
    }
}

function apply_exist()
{
    include_once('login.php');
    $id = get_current_user_id();
    $args = func_get_args();
    $key = $args[2];
    if(!$key)
        die('Invalid Argument!');
    connect_db();
    $view = "SELECT * FROM applications WHERE user_id='$id' AND tweet_id='$key' AND deleted='0'";
    $list = mysql_query($view);
    $row = mysql_fetch_array($list);
    if($row)
        echo "1";
    else
        echo "0";
}

function apply_add()
{
    include_once('login.php');
    $id = get_current_user_id();
    $args = func_get_args();
    $key = $args[2];
    if(!$key)
        die('Invalid Argument!');
    connect_db();
    $view = "SELECT * FROM applications WHERE user_id='$id' AND tweet_id='$key' AND deleted='0'";
    $list = mysql_query($view);
    $row = mysql_fetch_array($list);
    if($row)
    {
        applies_delete("", "", $key);
    }
    $view = "INSERT INTO applications(resume_id, tweet_id, user_id) VALUES ('$id', '$key', '$id')";
    $list = mysql_query($view) or die("Insert error!");
}

function theme_apply($content)
{
    theme('page', "申请", $content);
}

function user_apply($query)
{
    $key = (string) $query[1];
    if(!$key)
        $key = "show";
    $function = 'apply_'.$key;
    if (!function_exists($function))
        die("Invalid Argument!");
    return call_user_func_array($function, $query);
}
?>
