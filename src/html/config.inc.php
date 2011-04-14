<?php

$db_host = '127.0.0.1';
$db_name = 'apis';
$db_user = 'apis';
$db_pass = 'G2WvPRsxGEr77wEd';

define("SINA_AKEY", '961495784');
define("SINA_SKEY", '47d9d806a1dc04cc758be6f7213465bc');

define("ENCRYPTION_KEY", 'HustGNGisVeryGelivable');

define("LONGURL_KEY", 'true');

$base_url = 'http://'.$_SERVER['HTTP_HOST'];
if ($directory = trim(dirname($_SERVER['SCRIPT_NAME']), '/\,'))
  $base_url .= '/'.$directory;
define('BASE_URL', $base_url.'/');

?>
