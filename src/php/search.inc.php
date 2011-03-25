<?php
func_register(array(
    'search' => array(
        'callback' => 'search_page',
    ),
    'history' => array(
        'callback' => 'search_history',
        'security' => 'true',
    ),
));

function theme_search($title, $content)
{
    if($title=='首页')
        $content = '<div id="radio">
                本周新增职位3124个，今日新增职位666个</div>
                <div id="microblogs">'.$content;
    else
        $content = '<div id="microblogs"><div id="search-result-outer">
                    <div id="search-result">
                        <div class="left">
                            #<a class="keyword">'.mb_substr($title, 0, -9).'</a>#的搜索结果</div>
                        <a id="search-result-concern" class="left"></a><a id="search-result-rss" class="right">
                        </a>
                    </div>
                </div>'.$content;
    $content .= '</div>';
    theme('page', $title, $content);
}

function get_search_result($key, $num)
{
    connect_db();
    
    //$view = "SELECT * FROM tweets WHERE MATCH (content) AGAINST ('$key') ORDER BY post_datetime DESC";
    //FIXME: Cannot use this syntax.
    
    $key = explode(" ",$key);
    $key = "%".implode("%",$key)."%";
    
    $view = "SELECT * FROM tweets WHERE content LIKE '$key' ORDER BY post_datetime DESC LIMIT 0 , $num";
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

function get_newest_result($num)
{
    connect_db();
    $view = "SELECT * FROM tweets ORDER BY post_datetime DESC LIMIT 0 , $num";
    
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
    $key = (string) $query[1];
    if(!$key)
    {
        $key = $_POST['search_text'];
        if(!$key)
            die("Invalid argument!");
    }
    include_once('login.inc.php');
    if(user_is_authenticated())
        search_history_add("", "", $key);
    $data = get_search_result($key, 10);
    $content = theme('result', $data);
    theme('search', $key." - 搜索", $content);
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
        $result[$i++] = $row['search'];
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
    $content = "";
    foreach($data as $s)
    {
        $content .= $s."<br />";
    }
    theme('page', '搜索历史', $content);
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
        search_history_delete("", "", $row['id']);
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
?>
