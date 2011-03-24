<?php
func_register(array(
    'like' => array(
        'callback' => 'user_like',
    ),
));

function theme_like($content)
{
    theme('page', "收藏", $content);
}

function user_like($query)
{
    $key = (string) $query[1];
    if(!$key):
        die("Invalid argument!");
    endif;
    $content = '建设中...<br/>收藏关键词:'.$key;
    theme('like', $content);
}
?>
