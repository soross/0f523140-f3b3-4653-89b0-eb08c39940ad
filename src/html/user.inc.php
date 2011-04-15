<?php
include_once('common.inc.php');

func_register(array(
    'user' => array(
        'callback' => 'deal_user',
    ),
    'profile' => array(
        'callback' => 'profile_show',
    ),
));

function theme_user($data)
{
    include_once("theme.inc.php");
    $content = '';
    foreach($data as $r)
    {
        if(strstr($r['source'], '<'))
            $source = str_replace("<a ", '<a class="left microblog-item-position"', $r['source']);
        else
            $source = '<a class="left microblog-item-position">'.$r['source'].'</a>';
        $content .= '<div class="item" id="'.$r['tweet_id'].'">
                        <div class="item-delete">
                            <a class="right"></a>
                        </div>
                        <div class="left item-pic">
                            <img alt="" width="50" height="50" src="'.$r['profile_image_url'].'">
                        </div>
                        <div class="left item-content">
                            <div class="item-blog">
                                <a class="item-blog-name" target="_blank" href="'.BASE_URL.'profile/'.$r['post_screenname'].'">'.$r['post_screenname'].'</a>：'.$r['content'].'
                            </div>
                            <div class="item-other">
                                <span class="left item-time">'.time_tran($r['post_datetime']).'</span>'.$source.'
                                <a class="right item-control last delete">
                                    删除</a>
                            </div>
                        </div>
                        <div class="clear">
                        </div>
                    </div>';
    }
    echo $content;
}

function get_user_tweets($key, $site, $num, $page, $count = false)
{
    connect_db();
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
    if(!$key)
    {
        include_once("login.inc.php");
        user_ensure_authenticated();
        $key = get_current_user_id();
    }
    if($site)
        $view = "SELECT $select from tweets WHERE deleted = 0 AND user_site_id = '$key' AND site_id = '$site' ORDER BY post_datetime DESC$limit";
    else
        $view = "SELECT $select from tweets, (SELECT user_site_id, site_id FROM accountbindings WHERE user_id = '$key') AS ac WHERE tweets.deleted = 0 AND tweets.user_site_id = ac.user_site_id AND tweets.site_id = ac.site_id ORDER BY tweets.post_datetime DESC$limit";
    $list = mysql_query($view);
    $result = array();
    $i = 0;
    while($row = mysql_fetch_array($list))
        $result[$i++] = $row;
    return $result;
}

function user_count()
{
    $args = func_get_args();
    $user = $args[2];
    $site = get_post('site_id');
    $data = get_user_tweets($user, $site, 10, "", true);
    echo $data[0][0];
}

function user_show()
{
    $args = func_get_args();
    $user = $args[2];
    $page = get_post('page');
    $site = get_post('site_id');
    $data = get_user_tweets($user, $site, 10, $page);
    theme('user', $data);
}

function user_info()
{
    include_once("login.inc.php");
    user_ensure_authenticated();
    show_credentials();
}

function user_set_role()
{
    user_ensure_authenticated();
    $id = get_current_user_id();
    $args = func_get_args();
    $key = $args[2];
    if($key == "" or ($key != "1" and $key != "2"))
        die("Invalid argument!");
    connect_db();
    $view = "SELECT role_id FROM userinfo WHERE user_id='$id'";
    $list = mysql_query($view);
    $row = mysql_fetch_array($list);
    $role = $row['role_id'];
    if($role != -1)
        die('Role already set!');
    $view = "UPDATE userinfo SET role_id=".$key." WHERE user_id='".$id."'";
    $list = mysql_query($view) or die("Update error!");
    $GLOBALS['user']['role'] = $key;
    save_cookie();
}

function user_role_show()
{
    user_ensure_authenticated();
    echo $GLOBALS['user']['role'];
}

function user_role()
{
    user_role_show();
}

function deal_user($query)
{
    $key = (string) $query[1];
    if(!$key)
        $key = "show";
    $function = 'user_'.$key;
    if (!function_exists($function))
        die("Invalid Argument!");
    return call_user_func_array($function, $query);
}

function profile_show()
{
    /*$args = func_get_args();
    $key = $args[2];*/
    $key = (string) $query[1];
    if(!$key)
        die("Invalid Argument!");
    header('Location: http://t.sina.com.cn/n/'.$key);
}

/*function deal_profile($query)
{
    $key = (string) $query[1];
    if(!$key)
        $key = "show";
    $function = 'profile_'.$key;
    if (!function_exists($function))
        die("Invalid Argument!");
    return call_user_func_array($function, $query);
}*/
?>
