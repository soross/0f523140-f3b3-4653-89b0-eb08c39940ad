<?php

function get_tags($id)
{
    include_once("common.inc.php")
    connect_db();
    $view = "SELECT tags.name from tags, (SELECT * FROM tag_relationship WHERE tweet_id='$id') as r WHERE r.tag_id=tags.tag_id ORDER BY tags.count DESC";
    $list = mysql_query($view);
    $result = array();
    $i = 0;
    while($row = mysql_fetch_array($list))
    {
        $result[$i++] = $row[0];
        if($i == $num)
            break;
    }
    if($i == 0)
        return false;
    return $result;
}
?>
