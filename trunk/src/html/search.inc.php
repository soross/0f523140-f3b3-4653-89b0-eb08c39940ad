<?php
func_register(array(
    'search' => array(
        'callback' => 'deal_search',
    ),
    'history' => array(
        'callback' => 'deal_search_history',
        'security' => 'true',
    ),
    'count' => array(
        'callback' => 'count_show',
    ),
));

function theme_search($key, $content)
{
    /*if($title=='首页')
    {
        $GLOBALS['search'] = "淘宝";
        include_once("common.inc.php");
        $counts = get_counts();
        $pre = '<div id="radio">
                本周新增职位'.$counts['tweets_thisweek'].'个，今日新增职位'.$counts['tweets_today'].'个</div>
                <div id="microblogs">';
    }
    else
    {
        $GLOBALS['search'] = $key;
        $pre = '<div id="search-result-outer">
                    <div id="search-result">
                        <div class="left">
                            #<a class="keyword">'.$key.'</a>#的搜索结果</div>';
        #include_once("follow.inc.php");
        $pre .= '<a id="search-result-concern" class="left"></a>';
        $pre .= '<a id="search-result-rss" class="right">
                        </a>
                    </div>
                </div>';
    }
    $content = $pre.$content;*/
    theme('page', $key, $content);
}

function get_search_result($key, $num, $cate, $time, $page)
{
    connect_db();
    
    //$view = "SELECT * FROM tweets WHERE MATCH (content) AGAINST ('$key') ORDER BY post_datetime DESC";
    //FIXME: Cannot use this syntax.
    if($key and $key != "all" and $key != "poiuy")
    {
        $key = explode(" ",$key);
        $key = "%".implode("%",$key)."%";
        $key = " AND tweets.content LIKE '$key'";
    }
    else
        $key = "";
    if($cate and $cate!="0")
    {
        $cate1 = ",(SELECT * from cat_relationship WHERE cat_id=$cate) AS cate";
        $cate2 = " AND tweets.tweet_id=cate.tweet_id";
    }
    else
    {
        $cate1 = ",(SELECT * from cat_relationship WHERE cat_id!=8) AS cate";
        $cate2 = " AND tweets.tweet_id=cate.tweet_id";
        #$cate1 = $cate2 = "";
    }
    $limit = " LIMIT 0 , $num";
    $content = "*";
    if($time == "page")
    {
        $page = intval($page) * $num;
        $limit = " LIMIT $page , $num";
        $time = "";
    }
    elseif($time == "count")
    {
        $content = "COUNT(*)";
        $limit = "";
        $time = "";
    }
    elseif($time)
    {
        if(intval($time) > 0)
            $fuhao = ">";
        else
        {
            $fuhao = "<";
            $time = strval(0 - intval($time));
        }
        $time = " AND tweets.post_datetime".$fuhao."\"".date('Y-m-d H:i:s', $time)."\"";
    }
    $view = "SELECT DISTINCT $content FROM tweets$cate1 WHERE tweets.deleted = 0$key$cate2$time ORDER BY tweets.post_datetime DESC$limit";
    //FIXME: Low performance!
    
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

function search_show()
{
    $args = func_get_args();
    $cate = $args[2];
    $time = (string) $_POST['time'];
    $page = (string) $_POST['page'];
    $key = (string) $_POST['search'];
    if($key and $key != "all" and $key != "poiuy")
    {
        include_once('login.inc.php');
        if(user_is_authenticated())
        search_history_add("", "", $key);
    }
    $data = get_search_result($key, 10, $cate, $time, $page);
    $content = theme('result', $data, $key);
    theme('search', $key, $content);
}

function search_count()
{
    $args = func_get_args();
    $cate = $args[2];
    $key = (string) $_POST['search'];
    $data = get_search_result($key, 10, $cate, "count", "");
    theme('page', 'count', $data[0][0]);
}

function search_rss()
{
    $key = (string) $_POST['search'];
    $args = func_get_args();
    $cate = $args[2];
    if(!$key)
        die("Invalid argument!");
    $data = get_search_result($key, 10, $cate, "", "");
    $GLOBALS['search'] = $key;
    theme('rss', $data);
}
    
function deal_search($query)
{
    $key = (string) $query[1];
    if(!$key)
        $key = "show";
    $function = 'search_'.$key;
    if (!function_exists($function))
        die("Invalid Argument!");
    return call_user_func_array($function, $query);
}

function get_search_history($num)
{
    include_once('login.inc.php');
    $id = get_current_user_id();
    connect_db();
    $view = "SELECT * FROM searchhistory WHERE user_id='$id' AND deleted=0 ORDER BY add_time DESC";
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

function search_history_show()
{
    $args = func_get_args();
    $key = intval($args[2]);
    $data = get_search_history($key);
    $content = '';
    foreach($data as $h)
    {
        $search = mb_substr($h['search'], 0, 20, "utf8");
        if($search != $h['search'])
            $search .= '...';
        $content .= '<div class="history-item" title="'.$h['search'].'">
                    <a>'.$search.'</a></div>';
    }
    $content .= '</div>';
    echo $content;
}

function search_history_delete()
{
    include_once('login.inc.php');
    $id = get_current_user_id();
    $args = func_get_args();
    $key = $args[2];
    if(!$key)
        die('Invalid Argument!');
    connect_db();
    $view = "SELECT * FROM searchhistory WHERE user_id='$id' AND history_id='$key' AND deleted='0'";
    $list = mysql_query($view);
    $row = mysql_fetch_array($list);
    if($row)
    {
        $view = "UPDATE searchhistory SET deleted='1' WHERE user_id='$id' AND history_id='$key'";
        $list = mysql_query($view) or die("Delete error!");
    }
    else
    {
        print $key;
        die(": Non-exist Error!");
    }
}

function search_history_deleteall()
{
    include_once('login.inc.php');
    $id = get_current_user_id();
    connect_db();
    $view = "UPDATE searchhistory SET deleted='1' WHERE user_id='$id'";
    $list = mysql_query($view) or die("Delete error!");
    header("Location: ".BASE_URL);
}

function search_history_add()
{
    include_once('login.inc.php');
    $id = get_current_user_id();
    $args = func_get_args();
    $key = $_POST['search'];
    if(!$key)
        die('Invalid Argument!');
    connect_db();
    $view = "SELECT * FROM searchhistory WHERE user_id='$id' AND search='$key' AND deleted='0'";
    $list = mysql_query($view);
    $row = mysql_fetch_array($list);
    if($row)
    {
        search_history_delete("", "", $row['history_id']);
    }
    include_once("uuid.inc.php");
    $v4uuid = str_replace("-", "", UUID::v4());
    $current_datetime = date('Y-m-d H:i:s');
    $view = "INSERT INTO searchhistory(history_id, search, user_id, deleted, add_time) VALUES ('$v4uuid', '$key', '$id', '0', '$current_datetime')";
    $list = mysql_query($view) or die("Insert error!");
}

function deal_search_history($query)
{
    $key = (string) $query[1];
    if(!$key)
        $key = "show";
    $function = 'search_history_'.$key;
    if (!function_exists($function))
        die("Invalid Argument!");
    return call_user_func_array($function, $query);
}

function count_show()
{
    $counts = get_counts();
    $r = $counts['tweets_thisweek'].','.$counts['tweets_today'];
    echo $r;
}
?>
