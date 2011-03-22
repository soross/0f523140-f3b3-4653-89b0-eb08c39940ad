<?php

session_start();
include_once('common.inc.php');
include_once('theme.php');
include_once('login.php');
include_once('search.php');
include_once('follow.php');
include_once('favorite.php');
#include_once('.php');
#include_once('.php');

func_register(array(
  '' => array(
    'callback' => 'home_page',
  ),
));

function theme_home($content)
{
    theme('page', "首页", $content);
}

function home_page()
{
    $content = "Hello world!<br>";
    if(user_is_authenticated())
    {
        $content .= $GLOBALS['user']['nickname']."已登陆<br/><a href='logout'>退出</a>";
    }
    else
        $content .= "尚未登陆, 请点击<a href='login'>这里</a>登陆.";
    theme_home($content);
}

func_execute_active_handler();
?>

