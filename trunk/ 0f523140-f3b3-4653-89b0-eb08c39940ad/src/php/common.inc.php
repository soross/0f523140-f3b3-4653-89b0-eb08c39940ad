<?
include_once('config.inc.php');
function connect_db(){
    global $db_host, $db_name, $db_user, $db_pass;
    mysql_pconnect($db_host, $db_user, $db_pass);
    @mysql_select_db($db_name)  or die ("Unable to connect to database");
}

function func_register($items) {
    foreach ($items as $url => $item) {
        $GLOBALS['func_registry'][$url] = $item;
    }
}

function func_execute_active_handler() {
	if(isset($_GET['q']))
	{
		$query = (array) explode('/', $_GET['q']);
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

    if (function_exists('config_log_request'))
        config_log_request();
        
    if (function_exists($page['callback']))
        return call_user_func($page['callback'], $query);

    return false;
}
?>
