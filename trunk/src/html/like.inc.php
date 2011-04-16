<?php
include_once('common.inc.php');

func_register(array(
    'like' => array(
        'callback' => 'deal_like',
        'security' => 'true',
    ),
));

function like_count()
{
    include_once('login.inc.php');
    $id = get_current_user_id();
    connect_db();
    $view = "SELECT COUNT(*) FROM favorites WHERE user_id='$id' AND deleted = 0";
    $list = mysql_query($view);
    $row = mysql_fetch_array($list);
    echo $row[0];
}

function get_likes($num, $page)
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

function like_show()
{
    $args = func_get_args();
    if(get_post('page'))
        $page = intval(get_post('page'));
    else
        $page = "";
    $content = '';
    include_once("theme.inc.php");
    $favorites = get_likes(10, $page);
    include_once("apply_sent.inc.php");
    $allapp = get_sent_applies(32767, "");
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
                           <a target="_blank" href="http://api.t.sina.com.cn/'.$r['user_site_id'].'/statuses/'.$r['tweet_site_id'].'" class="left item-time">'.time_tran($f['post_datetime']).'</a> '.$source.'
                           <a class="right item-favourite item-action delete">取消收藏</a> ';
                            if($f['type'] != 1)
                            {
                                $app = 0;
                                foreach($allapp as $r)
                                    if($f['tweet_id'] == $r['tweet_id'])
                                    {
                                        $app = 1;
                                        break;
                                    }
                                if(!$app)
                                    $content .= '<a class="right item-favourite item-doapply apply" onclick="JobApply(this,\''.$f['tweet_id'].'\',\''.$f['post_screenname'].'\')">
                                            申请该职位</a><a class="right item-favourite item-doapply unapply" style="display: none;" onclick="JobUnApply(this,\''.$f['tweet_id'].'\')">
                                            取消申请</a>';
                                else
                                    $content .= '<a class="right item-favourite item-doapply apply" style="display: none;" onclick="JobApply(this,\''.$f['tweet_id'].'\',\''.$f['post_screenname'].'\')">
                                            申请该职位</a><a class="right item-favourite item-doapply unapply" onclick="JobUnApply(this,\''.$f['tweet_id'].'\')">
                                            取消申请</a>';
                            }
        $content .= '
                       </div>
                   </div>
                   <div class="clear">
                   </div>
               </div>';
    }
    echo $content;
}

function like_delete()
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

function like_exist()
{
    include_once('login.inc.php');
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

function like_add()
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
        die("Dulplicate Error!");
        #like_delete("", "", $key);
    $view = "INSERT INTO favorites(tweet_id, user_id, deleted) VALUES ('$key', '$id', '0')";
    $list = mysql_query($view) or die("Insert error!");
}

function theme_like($content)
{
    theme('page', "收藏", $content);
}

function deal_like($query)
{
    $key = (string) $query[1];
    if(!$key)
        $key = "show";
    $function = 'like_'.$key;
    if (!function_exists($function))
        die("Invalid Argument!");
    return call_user_func_array($function, $query);
}
?>
