<?php
session_start();
include_once('common.inc.php');
include_once('theme.inc.php');
include_once('login.inc.php');
include_once('search.inc.php');
include_once('follow.inc.php');
include_once('like.inc.php');
include_once('hot.inc.php');
include_once('user.inc.php');
include_once('tweet.inc.php');
include_once('resume.inc.php');
include_once('apply_sent.inc.php');
include_once('apply_received.inc.php');
include_once('avatar.inc.php');
include_once('feedback.inc.php');
include_once('count.inc.php');

func_register(array(
  '' => array(
    'callback' => 'home_page',
  ),
  'manager' => array(
    'callback' => 'manager_page',
    'security' => 'true',
  ),
  'feedback' => array(
    'callback' => 'feedback_page',
  ),
  'help' => array(
    'callback' => 'help_page',
  ),
  'admin' => array(
    'callback' => 'admin_page',
    'admin' => 'true',
  ),
));

function home_page()
{
    #theme('template', 'default.html');
    #header("Location: ".BASE_URL."default.html");
    #$content = theme('result', get_newest_result(10));
    #theme('search', '首页', $content);
    echo "502: Service Unavailable";
}

function manager_page()
{
    theme('template', 'manager.html');
}

function feedback_page($query)
{
    $key = (string) $query[1];
    if(!$key)
        theme('template', 'feedback.html');
    else
    {
        $function = 'feedback_'.$key;
        if (!function_exists($function))
            die("Invalid Argument!");
        return call_user_func_array($function, $query);
    }
}

function help_page()
{
    theme('template', 'help.html');
}

function admin_page()
{
    theme('template', 'admin.html');
}
func_execute_active_handler();
?>
