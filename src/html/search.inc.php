<?php
func_register(array(
    'search' => array(
        'callback' => 'search_page',
    ),
    'history' => array(
        'callback' => 'search_history',
        'security' => 'true',
    ),
    'rss' => array(
        'callback' => 'get_rss',
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
    if($key and $key != "all")
    {
        $key = explode(" ",$key);
        $key = "%".implode("%",$key)."%";
        $key = "tweets.content LIKE '$key'";
    }
    else
        $key = "";
    if($cate and $cate!="0")
    {
        $cate1 = ",(SELECT * from cat_relationship WHERE cat_id=$cate) AS cate";
        $cate2 = " tweets.tweet_id=cate.tweet_id";
    }
    else
        $cate1 = $cate2 = "";
    $limit = " LIMIT 0 , $num";
    $content = "tweets.*";
    if($time == "page")
    {
        $page = intval($page) * 10;
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
        $time = " tweets.post_datetime".$fuhao."\"".date('Y-m-d H:i:s', $time)."\"";
    }
    if(!$key and !$cate2 and !$time)
        $where = "";
    else
        $where = "WHERE ";
    if($key and $cate or $key and $time)
        $and1 = " AND ";
    else
        $and1 = "";
    if($cate and $time)
        $and2 = " AND ";
    else
        $and2 = "";
    $view = "SELECT $content FROM tweets$cate1 $where$key$and1$cate2$and2$time ORDER BY tweets.post_datetime DESC$limit";
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

function search_page($query)
{
    $cate = (string) $query[2];
    $time = (string) $query[3];
    $page = (string) $query[4];
    $key = (string) $query[1];
    if($key and $key != "all")
    {
        include_once('login.inc.php');
        if(user_is_authenticated())
        search_history_add("", "", $key);
    }
    $data = get_search_result($key, 10, $cate, $time, $page);
    $content = theme('result', $data);
    if($time == "count")
        theme('page', 'count', $data[0][0]);
    else
        theme('search', $key, $content);
}

function get_rss($query)
{
    $key = (string) $query[1];
    if(!$key)
    {
        $key = $_POST['search_text'];
        if(!$key)
            die("Invalid argument!");
    }
    $data = get_search_result($key, 10);
    $GLOBALS['search'] = $key;
    theme('rss', $data);
}

function get_search_history($num)
{
    include_once('login.php');
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
    $content = '<div class="left-title">
                    <span class="left left-title-text">搜索历史</span> <a class="right left-title-pic" id="history-pic">
                    </a>
                </div>';
    foreach($data as $h)
        $content .= '<div class="history-item">
                    <a>'.$h['search'].'</a></div>';
    $content .= '</div>';
    echo $content;
}

function search_history_delete()
{
    include_once('login.php');
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
    include_once('login.php');
    $id = get_current_user_id();
    connect_db();
    $view = "UPDATE searchhistory SET deleted='1' WHERE user_id='$id'";
    $list = mysql_query($view) or die("Delete error!");
    header("Location: ".BASE_URL);
}

function search_history_add()
{
    include_once('login.php');
    $id = get_current_user_id();
    $args = func_get_args();
    $key = $args[2];
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
    $list = mysql_query($view) or die($view."Insert error!");
}

function search_history($query)
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
