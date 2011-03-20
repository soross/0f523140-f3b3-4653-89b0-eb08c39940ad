<?php

session_start();
if( isset($_SESSION['last_key']) ) header("Location: weibolist.php");
include_once( 'config.php' );
include_once( 'weibooauth.php' );

$o = new WeiboOAuth( WB_AKEY , WB_SKEY  );

$keys = $o->getRequestToken();

$base_url = 'http://'.$_SERVER['HTTP_HOST'];
if ($directory = trim(dirname($_SERVER['SCRIPT_NAME']), '/\,')) {
  $base_url .= '/'.$directory;
}
define('BASE_URL', $base_url.'/');

$callback = BASE_URL."callback.php";

$aurl = $o->getAuthorizeURL( $keys['oauth_token'] ,false , $callback );

$_SESSION['keys'] = $keys;


?>
<a href="<?=$aurl?>">Use Oauth to login</a>
