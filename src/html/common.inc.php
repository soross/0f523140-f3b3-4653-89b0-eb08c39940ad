<?
include_once('config.inc.php');

function connect_db(){
    global $db_host, $db_name, $db_user, $db_pass;
    mysql_pconnect($db_host, $db_user, $db_pass);
    mysql_query("SET NAMES 'utf8'"); 
    @mysql_select_db($db_name)  or die ("Unable to connect to database");
}

function func_register($items) {
    foreach ($items as $url => $item)
        $GLOBALS['func_registry'][$url] = $item;
}

function long_url($shortURL)
{
    if (!defined('LONGURL_KEY'))
        return $shortURL;
    $url = "http://www.longurlplease.com/api/v1.1?q=" . $shortURL;
    $curl_handle=curl_init();
    curl_setopt($curl_handle,CURLOPT_RETURNTRANSFER,1);
    curl_setopt($curl_handle,CURLOPT_URL,$url);
    $url_json = curl_exec($curl_handle);
    curl_close($curl_handle);

    $url_array = json_decode($url_json,true);
    
    $url_long = $url_array["$shortURL"];
    
    if ($url_long == null)
        return $shortURL;

    if (substr($url_long,0,4) !== "http")
    {
        preg_match("/^(http:\/\/)?([^\/]+)/i", $shortURL, $matches);
        $host = $matches[2];
        $url_long="http://".$host."/".$url_long;
    }
        
    return $url_long;
}

function format_str($str)
{
    $str = str_replace("'", "\\\'", $str);
    $str = str_replace("\"", "\\\"", $str);
    $str = str_replace("<", "&lt;", $str);
    $str = str_replace(">", "&gt;", $str);
    return $str;
}

function get_post($item, $decode = true)
{
    if(isset($_POST[$item]))
    {
        if($decode)
            $item = format_str(urldecode($_POST[$item]));
        else
            $item = format_str($_POST[$item]);
    }
    else
        $item = false;
    return $item;
}

function func_execute_active_handler() {
    if(isset($_GET['q']))
    {
        $q = format_str($_GET['q']);
        $query = (array) explode('/', $q);
        $GLOBALS['page'] = $query[0];
    }
    else
    {
        $query = "";
        $GLOBALS['page'] = "";
    }
    $page = $GLOBALS['func_registry'][$GLOBALS['page']];
    if (!$page) {
        header('HTTP/1.0 404 Not Found');
        die('404 - Page not found.');
    }
  
    if (isset($page['security']) && $page['security'])
        user_ensure_authenticated();
        
    if (isset($page['admin']) && $page['admin'])
        user_ensure_admin();

    if (function_exists('config_log_request'))
        config_log_request();
        
    if (function_exists($page['callback']))
        return call_user_func($page['callback'], $query);

    return false;
}

function get_categories()
{
    connect_db();
    $view = "SELECT * FROM categories ORDER BY cat_id ASC";
    $list = mysql_query($view);
    $result = array();
    $i = 0;
    while($row = mysql_fetch_array($list))
        $result[$i++] = $row;
    return $result;
}

function get_counts()
{
    connect_db();
    $view = "SELECT * FROM counts";
    $list = mysql_query($view);
    $result = array();
    $i = 0;
    while($row = mysql_fetch_array($list))
        $result[$row['type']] = $row['count'];
    return $result;
}
?>
