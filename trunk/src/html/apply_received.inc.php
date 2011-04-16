<?php
include_once('common.inc.php');

func_register(array(
    'apply_received' => array(
        'callback' => 'deal_apply_received',
        'security' => 'true',
    ),
));

function get_received_tweets($num, $page, $count = false)
{
    include_once('login.inc.php');
    $id = get_current_user_id();
    if($count)
    {
        $limit = "";
        $select = "COUNT(DISTINCT tweets.tweet_id)";
        $groupby = "";
    }
    else
    {
        if(!$page)
            $page = "0";
        $select = "*";
        $page = intval($page) * $num;
        $limit = " LIMIT $page , $num";
        $groupby = " GROUP BY tweets.tweet_id";
    }
    connect_db();
    $view = "SELECT $select from tweets, (SELECT * FROM applications WHERE deleted=0) AS ap, (SELECT * from accountbindings WHERE user_id = '$id') AS ab WHERE tweets.deleted=0 AND tweets.tweet_id=ap.tweet_id AND tweets.user_site_id = ab.user_site_id AND tweets.site_id = ab.site_id$groupby ORDER BY tweets.post_datetime DESC$limit";
    $list = mysql_query($view);
    $result = array();
    $i = 0;
    while($row = mysql_fetch_array($list))
        $result[$i++] = $row;
    return $result;
}

function get_received_applies($tweet_id, $num, $page, $count = false)
{
    include_once('login.inc.php');
    $id = get_current_user_id();
    if($count)
    {
        $limit = "";
        $select = "COUNT(*)";
    }
    else
    {
        if(!$page)
            $page = "0";
        $select = "*";
        $page = intval($page) * $num;
        $limit = " LIMIT $page , $num";
    }
    connect_db();
    $view = "SELECT $select from applications AS ap, (SELECT * FROM tweets WHERE tweet_id='$tweet_id' AND deleted=0) AS tweets, (SELECT user_site_id, site_id from accountbindings WHERE user_id = '$id') AS ab WHERE tweets.deleted=0 AND ap.deleted=0 AND ap.tweet_id='$tweet_id' AND tweets.user_site_id = ab.user_site_id AND tweets.site_id = ab.site_id ORDER BY tweets.post_datetime DESC$limit";
    $list = mysql_query($view);
    $result = array();
    $i = 0;
    while($row = mysql_fetch_array($list))
        $result[$i++] = $row;
    return $result;
}

function received_apply_show_tweet()
{
    $args = func_get_args();
    $tweet_id = $args[2];
    $page = get_post('page');
    $content = '';
    $applies = get_received_applies($tweet_id, 10, $page);
    foreach($applies as $r)
    {
        if($r['view_time'])
            $readinfo = "(已阅)";
        else
            $readinfo = "";
        $content .= '<div id="'.$r['resume_id'].'">
<span class="left">申请自：</span><a class="left item-applys-name">'.get_nick_by_id($r['user_id']).'</a><span class="left item-applys-time">于'.time_tran($r['apply_time']).$readinfo.'</span><a
                class="right item-applys-read">查看简历</a></div>';
    }
    echo $content;
}

function received_apply_count_tweet($tweet_id)
{
    $content = '';
    $applies = get_received_applies($tweet_id, 10, "", true);
    return $applies[0][0];
}

function received_apply_count()
{
    $content = '';
    $applies = get_received_tweets(10, "", true);
    $r = $applies[0][0];
    if($r)
        echo $r;
    else
        echo '0';
}

function received_apply_show()
{
    include_once("theme.inc.php");
    $key = get_post('page');
    $content = '';
    $results = get_received_tweets(10, $key);

    foreach($results as $r)
    {
        if(strstr($r['source'], '<'))
            $source = str_replace("<a ", '<a target="_blank" class="left microblog-item-position"', $r['source']);
        else
            $source = '<a class="left microblog-item-position" target="_blank">'.$r['source'].'</a>';
        $g = received_apply_count_tweet($r['tweet_id']);
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
                                <a class="right item-control last applys" id="'.$g.'">
                                    申请数('.$g.')</a>
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

function deal_apply_received($query)
{
    $key = (string) $query[1];
    if(!$key)
        $key = "show";
    $function = 'received_apply_'.$key;
    if (!function_exists($function))
        die("Invalid Argument!");
    return call_user_func_array($function, $query);
}
?>
