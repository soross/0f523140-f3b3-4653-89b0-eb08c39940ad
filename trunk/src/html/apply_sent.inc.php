<?php
func_register(array(
    'apply_sent' => array(
        'callback' => 'deal_apply_sent',
        'security' => 'true',
    ),
));

function get_sent_applies($num, $page)
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
    $view = "SELECT $select from tweets WHERE tweet_id IN (SELECT * FROM applications WHERE user_id='$id' AND deleted=0) AND tweets.deleted=0 ORDER BY tweets.post_datetime DESC$limit";
    $list = mysql_query($view);
    $result = array();
    $i = 0;
    while($row = mysql_fetch_array($list))
        $result[$i++] = $row;
    return $result;
}

function apply_sent_add()
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
        die('Dulplicate Error');
    $view = "INSERT INTO applications(resume_id, tweet_id, user_id, apply_time) VALUES ('$id', '$key', '$id', '".date('Y-m-d H:i:s')."')";
    $list = mysql_query($view) or die("Insert error!");
    $content = format_str($_POST['text']);
    $view = "SELECT tweet_site_id FROM tweets WHERE tweet_id='$key'";
    $list = mysql_query($view);
    $row = mysql_fetch_array($list);
    if($row)
    {
        $tweet_site_id = $row[0];
        include_once("sinaoauth.inc.php");
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

function apply_sent_count()
{
    include_once('login.inc.php');
    $num = get_applies(0, "count");
    echo $num[0][0];
}

function apply_sent_show()
{
    include_once("theme.inc.php");
    $args = func_get_args();
    if($_POST['page'])
        $page = intval($_POST['page']);
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

function apply_sent_delete()
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

function apply_sent_exist()
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

function deal_apply_sent($query)
{
    $key = (string) $query[1];
    if(!$key)
        $key = "show";
    $function = 'apply_sent_'.$key;
    if (!function_exists($function))
        die("Invalid Argument!");
    return call_user_func_array($function, $query);
}
?>
