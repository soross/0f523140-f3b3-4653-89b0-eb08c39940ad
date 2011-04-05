<?php
func_register(array(
    'apply' => array(
        'callback' => 'user_apply',
        'security' => 'true',
    ),
    'received' => array(
        'callback' => 'received_apply',
        'security' => 'true',
    ),
));

function get_received_tweets($num, $page)
{
    include_once('login.inc.php');
    $id = get_current_user_id();
    if(!$page)
        $page = "0";
    $page = intval($page) * $num;
    $limit = " LIMIT $page , $num";
    connect_db();
    $view = "SELECT * from tweets, (SELECT * FROM applications WHERE deleted=0) AS ap, (SELECT * from accountbindings WHERE user_id = '$id') AS ab WHERE tweets.tweet_id=ap.tweet_id AND tweets.user_site_id = ab.user_site_id AND tweets.site_id = ab.site_id AND ab.user_id = '$id' ORDER BY tweets.post_datetime DESC$limit";
    $list = mysql_query($view);
    $result = array();
    $i = 0;
    while($row = mysql_fetch_array($list))
        $result[$i++] = $row;
    return $result;
}

function get_received_applies($tweet_id, $num, $page)
{
    include_once('login.inc.php');
    $id = get_current_user_id();
    if(!$page)
        $page = "0";
    if($page == "count")
    {
        $limit = "";
        $select = "COUNT(*)";
    }
    else
    {
        $select = "*";
        $page = intval($page) * $num;
        $limit = " LIMIT $page , $num";
    }
    connect_db();
    $view = "SELECT $select from applications AS ap, (SELECT * FROM tweets WHERE tweet_id='$id' AND deleted=0) AS tweets, (SELECT * from accountbindings WHERE user_id = '$id') AS ab WHERE ap.deleted=0 AND ap.tweet_id='$id' AND tweets.user_site_id = ab.user_site_id AND tweets.site_id = ab.site_id AND ab.user_id = '$id' ORDER BY tweets.post_datetime DESC$limit";
    echo $view;
    $list = mysql_query($view);
    $result = array();
    $i = 0;
    while($row = mysql_fetch_array($list))
        $result[$i++] = $row;
    return $result;
}

function apply_count()
{
    include_once('login.inc.php');
    $id = get_current_user_id();
    connect_db();
    $view = "SELECT COUNT(*) FROM applications WHERE user_id='$id' AND deleted = 0";
    $list = mysql_query($view);
    $row = mysql_fetch_array($list);
    echo $row[0];
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
    $view = "SELECT * from tweets, (SELECT * FROM applications WHERE user_id='$id' AND deleted=0) as applications WHERE tweets.tweet_id=applications.tweet_id ORDER BY tweets.post_datetime DESC$limit";
    $list = mysql_query($view);
    $result = array();
    $i = 0;
    while($row = mysql_fetch_array($list))
        $result[$i++] = $row;
    return $result;
}

function received_apply()
{
    include_once("theme.inc.php");
    $content = '';
    $results = get_received_tweets(10, "");
    foreach($results as $r)
    {
        if(strstr($r['source'], '<'))
            $source = str_replace("<a ", '<a target="_blank" class="left microblog-item-position"', $r['source']);
        else
            $source = '<a class="left microblog-item-position" target="_blank">'.$r['source'].'</a>';
        $g = get_received_applies($r['tweet_id'],0,"count");
        $content = '<div class="item" id="'.$r['tweet_id'].'">
                        <div class="item-delete">
                            <a class="right"></a>
                        </div>
                        <div class="left item-pic">
                            <a target="_blank" href="'.BASE_URL.'profile/'.$r['post_screenname'].'"><img alt="" width="50" height="50" src="'.$r['profile_image_url'].'"/></a>
                        </div>
                        <div class="left item-content">
                            <div class="item-blog">
                                <a class="microblog-item-blog-name" target="_blank" href="'.BASE_URL.'profile/'.$r['post_screenname'].'">'
                                .$r['post_screenname'].'</a>：'.parselink($r['content']).'
                            </div>
                            <div class="item-other">
                                <span class="left item-time">'.time_tran($r['post_datetime']).'</span> '.$source.'
                                <a class="right item-control delete">删除</a> <a class="right item-control last applys">
                                    申请数('.$g[0][0].')</a>
                            </div>
                            <div class="item-applys close">';
    }
    $content .= '</div>
                        </div>
                        <div class="clear">
                        </div>
                    </div>';
}

function apply_show()
{
    include_once("theme.inc.php");
    $args = func_get_args();
    if($args[2])
        $page = intval($args[2]);
    else
        $page = "";
    $content = '';
    $applies = get_applies(10, $page);
    foreach($applies as $f)
    {
        if(strstr($f['source'], '<'))
            $source = str_replace("<a ", '<a class="left microblog-item-position"', $f['source']);
        else
            $source = '<a class="left microblog-item-position">'.$f['source'].'</a>';
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
                           <span class="left item-time">'.time_tran($f['post_datetime']).'</span> '.$source;
        if($f['view_time'])
            $content .= '<span class="right item-apply item-apply-info">'.time_tran($f['view_time']).'</span>';
        else
            $content .= '<span class="right item-apply item-apply-info">未读</span>';
        $content .= '<span class="right item-apply item-apply-name">状态：</span> <span class="right item-apply item-apply-info">'.time_tran($f['apply_time']).'</span> <span class="right item-apply item-apply-name">
                            申请于：</span>';
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
    include_once('login.inc.php');
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
        apply_delete("", "", $key);
    }
    $view = "INSERT INTO applications(resume_id, tweet_id, user_id, apply_time) VALUES ('$id', '$key', '$id', '".date('Y-m-d H:i:s')."')";
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
