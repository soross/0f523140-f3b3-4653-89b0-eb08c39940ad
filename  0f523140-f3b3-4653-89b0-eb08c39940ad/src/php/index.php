<?php

session_start();
include_once('common.inc.php');
include_once('theme.php');
include_once('login.php');

func_register(array(
  '' => array(
    'callback' => 'home_page',
  ),
));

function home_page()
{
    $content = "Hello world!<br>";
    if(user_is_authenticated())
    {
        $content .= $GLOBALS['user']['nickname']."已登陆";
    }
    else
        $content .= "尚未登陆, 请点击<a href='login'>这里</a>登陆.";
    theme('page', "首页", $content);
}

func_execute_active_handler();
?>
