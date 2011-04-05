<?php
session_start();
include_once('common.inc.php');
include_once('theme.inc.php');
include_once('login.inc.php');
include_once('search.inc.php');
include_once('follow.inc.php');
include_once('favorite.inc.php');
include_once('post.inc.php');
include_once('tag.inc.php');
include_once('user.inc.php');
include_once('tweet.inc.php');
include_once('resume.inc.php');

func_register(array(
  '' => array(
    'callback' => 'home_page',
  ),
));

function home_page()
{
    header("Location: ".BASE_URL."default.html");
    #$content = theme('result', get_newest_result(10));
    #theme('search', '首页', $content);
}

func_execute_active_handler();
?>

