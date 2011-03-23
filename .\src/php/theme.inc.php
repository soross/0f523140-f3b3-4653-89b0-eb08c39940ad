<?php

$current_theme = false;

function theme()
{
    global $current_theme;
    $args = func_get_args();
    $function = array_shift($args);
    $function = 'theme_'.$function;
  
    if ($current_theme) {
        $custom_function = $current_theme.'_'.$function;
        if (function_exists($custom_function))
            $function = $custom_function;
    }
    else
    {
        if (!function_exists($function))
            return "<p>Error: theme function <b>$function</b> not found.</p>";
    }
    return call_user_func_array($function, $args);
}

function theme_page($title, $content) {
    $body = theme('header');
    $body .= $content;
    $body .= theme('footer');
    $body .= theme('google_analytics');
    ob_start('ob_gzhandler');
    header('Content-Type: text/html; charset=utf-8');
    echo '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head><title>',$title,' - 微招聘</title><base href="',BASE_URL,'" />'.theme('css').'</head>
<body>', $body, '</body>
</html>';
    exit();
}

function theme_header()
{
    return "";
}

function theme_footer()
{
    return "";
}

function theme_css()
{
    return "";
}

function theme_google_analytics()
{
    global $GA_ACCOUNT;
    if (!$GA_ACCOUNT) return '';
    $googleAnalyticsImageUrl = googleAnalyticsGetImageUrl();
    return "<img src='{$googleAnalyticsImageUrl}' />";
}
?>
