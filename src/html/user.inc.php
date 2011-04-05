<?php
func_register(array(
    'user' => array(
        'callback' => 'user_page',
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
                                <a class="item-blog-name" target="_blank" href="http://t.sina.com.cn/n/'.$r['post_screenname'].'">'.$r['post_screenname'].'</a>：'.$r['content'].'
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

function get_user_result($key, $site, $num, $page)
{
    connect_db();
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
    if($key == "current")
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

function user_page($query)
{
    $page = (string) $query[3];
    $key = (string) $query[1];
    $site = (string) $query[2];
    if(!$key)
        die("Invalid Argument!");
    $data = get_user_result($key, $site, 10, $page);
    if($time == "count")
        theme('page', 'count', $data[0][0]);
    else
        theme('user', $data);
}


