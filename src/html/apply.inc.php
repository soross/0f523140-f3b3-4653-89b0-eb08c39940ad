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
    if($page == "count")
    {
        $limit = "";
        $select = "COUNT(DISTINCT tweets.tweet_id)";
    }
    else
    {
        $select = "*";
        $page = intval($page) * $num;
        $limit = " LIMIT $page , $num";
    }
    connect_db();
    $view = "SELECT $select from tweets, (SELECT * FROM applications WHERE deleted=0) AS ap, (SELECT * from accountbindings WHERE user_id = '$id') AS ab WHERE tweets.deleted=0 AND tweets.tweet_id=ap.tweet_id AND tweets.user_site_id = ab.user_site_id AND tweets.site_id = ab.site_id AND ab.user_id = '$id' GROUP BY tweets.tweet_id ORDER BY tweets.post_datetime DESC$limit";
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
    $view = "SELECT DISTINCT $select from applications AS ap, (SELECT * FROM tweets WHERE tweet_id='$tweet_id' AND deleted=0) AS tweets, (SELECT user_site_id, site_id from accountbindings WHERE user_id = '$id') AS ab WHERE tweets.deleted=0 AND ap.deleted=0 AND ap.tweet_id='$tweet_id' AND tweets.user_site_id = ab.user_site_id AND tweets.site_id = ab.site_id ORDER BY tweets.post_datetime DESC$limit";
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
    $num = get_applies(0, "count");
    echo $num[0][0];
}

function get_applies($num, $page)
{
    include_once('login.inc.php');
    $id = get_current_user_id();
    if(!$page)
        $page = "0";
    elseif($page == "count")
    {
        $select = "COUNT(*)";
        $limit = "";
    }
    else
    {
        $select = "*";
        $page = intval($page) * $num;
        $limit = " LIMIT $page , $num";
    }
    connect_db();
    $view = "SELECT DISTINCT $select from tweets, (SELECT * FROM applications WHERE user_id='$id' AND deleted=0) as applications WHERE tweets.deleted=0 AND tweets.tweet_id=applications.tweet_id ORDER BY tweets.post_datetime DESC$limit";
    $list = mysql_query($view);
    $result = array();
    $i = 0;
    while($row = mysql_fetch_array($list))
        $result[$i++] = $row;
    return $result;
}

function received_apply_show($tweet_id, $page)
{
    include_once("theme.inc.php");
    $content = '';
    $applies = get_received_applies($tweet_id, 10, $page);
    foreach($applies as $r)
        $content .= '<div id="'.$r['resume_id'].'">
<span class="left">申请自：</span><a class="left item-applys-name">'.get_nick_by_id($r['user_id']).'</a><span class="left item-applys-time">于'.time_tran($r['apply_time']).'</span><a
                class="right item-applys-read">查看简历</a></div>';
    echo $content;
}

function received_apply($query)
{
    include_once("theme.inc.php");
    $key = (string) $query[1];
    if($key == "apply")
    {
        $id = (string) $query[2];
        $page = (string) $query[3];
        return received_apply_show($id, $page);
    }
    $content = '';
    $results = get_received_tweets(10, $key);
    if($key == "count")
    {
        echo $results[0][0];
        return;
    }

    foreach($results as $r)
    {
        if(strstr($r['source'], '<'))
            $source = str_replace("<a ", '<a target="_blank" class="left microblog-item-position"', $r['source']);
        else
            $source = '<a class="left microblog-item-position" target="_blank">'.$r['source'].'</a>';
        $g = get_received_applies($r['tweet_id'],0,"count");
        $content .= '<div class="item" id="'.$r['tweet_id'].'">
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
                                <a class="right item-control last applys" id="'.$g[0][0].'">
                                    申请数('.$g[0][0].')</a>
                            </div>
                            <div class="item-applys close"></div><div class="item-page"></div>';
        $content .= '
                        </div>
                        <div class="clear">
                        </div>
                    </div>';
    }
    echo $content;
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
        if($f['deleted'])
            $temp = " job-closed";
        else
            $temp = "";
        $content .= '<div class="item'.$temp.'" id="'.$f['tweet_id'].'">
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
        if($f['deleted'])
            $content .= '<span class="right item-apply item-apply-info">已关闭</span>';
        elseif($f['view_time'])
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
        apply_delete("", "", $key);
    }
    $view = "INSERT INTO applications(resume_id, tweet_id, user_id, apply_time) VALUES ('$id', '$key', '$id', '".date('Y-m-d H:i:s')."')";
    $list = mysql_query($view) or die("Insert error!");
    $content = $_POST['text'];
    $view = "SELECT tweet_site_id FROM tweets WHERE tweet_id='$key'";
    $list = mysql_query($view);
    $row = mysql_fetch_array($list);
    if($row)
    {
        $tweet_site_id = $row[0];
        include_once("sinaoauth.php");
        $c = new WeiboClient(SINA_AKEY, SINA_SKEY, $GLOBALS['user']['sinakey']['oauth_token'], $GLOBALS['user']['sinakey']['oauth_token_secret']);
        $content = $content.' http://www.ybole.com/resume/show/'.$id;
        $msg = $c -> send_comment($tweet_site_id, $content);
        if ($msg === false || $msg === null){
            echo "Error occured";
            return false;
        }
        if (isset($msg['error_code']) && isset($msg['error'])){
            echo ('Error_code: '.$msg['error_code'].';  Error: '.$msg['error'] );
            return false;
        } 
    }
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
