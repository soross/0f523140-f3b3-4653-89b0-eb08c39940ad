<?php

func_register(array(
    'login' => array(
        'callback' => 'login_page',
    ),
    'sina_login' => array(
        'callback' => 'oauth_sina',
    ),
    'sina_callback' => array(
        'callback' => 'oauth_sina_callback',
    ),
    'logout' => array(
        'callback' => 'user_logout',
        'security' => 'true',
    ),
    'info' => array(
        'callback' => 'show_credentials',
        'security' => 'true',
    ),
));

function user_logout() {
    unset($GLOBALS['user']);
    setcookie('USER_AUTH', '', time() - 3600, '/');
    header("Location: ".BASE_URL);
}

function user_is_authenticated()
{
    if (!isset($GLOBALS['user'])) {
        if(array_key_exists('USER_AUTH', $_COOKIE)) {
            _user_decrypt_cookie($_COOKIE['USER_AUTH']);
            return true;
        } else {
            $GLOBALS['user'] = array();
            return false;
        }
    }
}

function user_ensure_authenticated()
{
    if(!user_is_authenticated())
        header("Location: ".BASE_URL."login");
}

function sina_get_credentials()
{
    include_once('sinaoauth.php');
    $c = new WeiboClient(SINA_AKEY, SINA_SKEY, $GLOBALS['user']['sinakey']['oauth_token'], $GLOBALS['user']['sinakey']['oauth_token_secret']);
    $me = $c -> verify_credentials();
    return($me);
}

function show_credentials()
{
    $me = sina_get_credentials();
    $r = '';
    foreach($me as $a)
        $r .= $a."<br>";
    theme('page', '_userinfo', $r);
}

function login_page()
{
    $content = "<a href='sina_login'>新浪微博登陆</a>";
    theme('page', '登陆', $content);
}

function _user_encryption_key() {
    return ENCRYPTION_KEY;
}

function _user_encrypt_cookie() {
    $plain_text  = urlencode($GLOBALS['user']['nickname']) . ':' . urlencode($GLOBALS['user']['id']) . ':' . urlencode($GLOBALS['user']['role']) . ':';
    $plain_text .= urlencode($GLOBALS['user']['sinakey']['oauth_token']) . ':' . urlencode($GLOBALS['user']['sinakey']['oauth_token_secret']);
    $td = mcrypt_module_open('blowfish', '', 'cfb', '');
    $iv = mcrypt_create_iv(mcrypt_enc_get_iv_size($td), MCRYPT_RAND);
    mcrypt_generic_init($td, _user_encryption_key(), $iv);
    $crypt_text = mcrypt_generic($td, $plain_text);
    mcrypt_generic_deinit($td);
    return base64_encode($iv.$crypt_text);
}

function _user_decrypt_cookie($crypt_text) {
    $crypt_text = base64_decode($crypt_text);
    $td = mcrypt_module_open('blowfish', '', 'cfb', '');
    $ivsize = mcrypt_enc_get_iv_size($td);
    $iv = substr($crypt_text, 0, $ivsize);
    $crypt_text = substr($crypt_text, $ivsize);
    mcrypt_generic_init($td, _user_encryption_key(), $iv);
    $plain_text = mdecrypt_generic($td, $crypt_text);
    mcrypt_generic_deinit($td);
  
    list($GLOBALS['user']['nickname'], $GLOBALS['user']['id'], $GLOBALS['user']['role']
        ,$GLOBALS['user']['sinakey']['oauth_token'], $GLOBALS['user']['sinakey']['oauth_token_secret']
        ) = explode(':', $plain_text);
    $GLOBALS['user']['nickname'] = urldecode($GLOBALS['user']['nickname']);
    $GLOBALS['user']['id'] = urldecode($GLOBALS['user']['id']);
    $GLOBALS['user']['role'] = urldecode($GLOBALS['user']['role']);
    $GLOBALS['user']['sinakey']['sinakey'] = urldecode($GLOBALS['user']['sinakey']['sinakey']);
    $GLOBALS['user']['sinakey']['oauth_token_secret'] = urldecode($GLOBALS['user']['sinakey']['oauth_token_secret']);
}

function save_cookie($stay_logged_in = 1) {
  $cookie = _user_encrypt_cookie();
  $duration = 0;
  if ($stay_logged_in) {
    $duration = time() + (3600 * 24 * 365);
  }
  setcookie('USER_AUTH', $cookie, $duration, '/');
}

function oauth_sina()
{
    include_once('sinaoauth.php');
    $o = new WeiboOAuth(SINA_AKEY, SINA_SKEY);
    $keys = $o -> getRequestToken();
    $callback = BASE_URL."sina_callback";
    $aurl = $o -> getAuthorizeURL($keys['oauth_token'], false, $callback);
    $_SESSION['sinakeys'] = $keys;
    header("Location: $aurl");
}

function oauth_sina_callback()
{
    include_once('sinaoauth.php');
    $o = new WeiboOAuth(SINA_AKEY, SINA_SKEY, $_SESSION['sinakeys']['oauth_token'], $_SESSION['sinakeys']['oauth_token_secret']);
    $last_key = $o -> getAccessToken($_REQUEST['oauth_verifier']);
    $GLOBALS['user']['sinakey'] = $last_key;
    connect_db();
    $me = sina_get_credentials() or die("Cound not get data from Sina API");
    if(!$me['id'])
        die("Cound not get data from Sina API");
    $view = "SELECT * FROM accountbindings WHERE site_id='1' AND user_site_id='".$me['id']."'";
    $list = mysql_query($view);
    $row = mysql_fetch_array($list); 
    if(!$row)
    {
        include_once("uuid.inc.php");
        $v4uuid = str_replace("-", "", UUID::v4());
        $add = "INSERT INTO userinfo(nickname, email, microblogs, user_id, role_id) VALUES ('".$me['name']."', '', '1', '$v4uuid', '0')";
        echo $add;
        $added = mysql_query($add) or die("Could not add entry");
        $add = "INSERT INTO accountbindings(user_id, user_site_id, site_id, secret1, secret2) VALUES ('$v4uuid', '".$me['id']."', 1, '".$GLOBALS['user']['sinakey']['oauth_token']."', '".$GLOBALS['user']['sinakey']['oauth_token_secret']."')";
        $added = mysql_query($add) or die("Could not add entry");
        $id = $v4uuid;
        $role = 0;
        $nick = $me['name'];
    }
    else
    {
        $id = $row['user_id'];
        $updatekey = "UPDATE accountbindings SET secret1='".$GLOBALS['user']['sinakey']['oauth_token']."',secret2='".$GLOBALS['user']['sinakey']['oauth_token_secret']."' WHERE user_id='$id'";
        $result = mysql_query($updatekey);
        $view = "SELECT * FROM userinfo WHERE user_id='$id'";
        $list = mysql_query($view);
        $row = mysql_fetch_array($list); 
        $role = $row['role_id'];
        $nick = $row['nickname'];
    }
    $GLOBALS['user']['nickname'] = $nick;
    $GLOBALS['user']['id'] = $id;
    $GLOBALS['user']['role'] = $role;
    save_cookie();
    header("Location: ".BASE_URL);
}

function db_get_sinakey()
{
    connect_db();
    $view = "SELECT * FROM accountbindings WHERE site_id='1' AND user_id='".$GLOBALS['user']['id']."'";
    $list = mysql_query($view);
    $row = mysql_fetch_array($list);
    if(!row)
        user_logout();
    else
        $GLOBALS['user']['sinakey'] = array(
            'oauth_token' => $row['secret1'],
            'oauth_token_secret' => $row['secret2'],
            );
}
?>
