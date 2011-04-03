<?php
func_register(array(
    'hot' => array(
        'callback' => 'theme_hot',
    ),
));

function get_tags($id)
{
    include_once("common.inc.php");
    connect_db();
    $view = "SELECT tags.name from tags, (SELECT * FROM tag_relationship WHERE tweet_id='$id') as r WHERE r.tag_id=tags.tag_id ORDER BY tags.count DESC";
    $list = mysql_query($view);
    $result = array();
    $i = 0;
    while($row = mysql_fetch_array($list))
    {
        $result[$i++] = $row[0];
        if($i == 7)
            break;
    }
    if($i == 0)
        return false;
    return $result;
}

function get_hot($num)
{
    include_once("common.inc.php");
    connect_db();
    $view = "SELECT name,count,tag_group from tags ORDER BY count DESC";
    $list = mysql_query($view);
    $result = array();
    $i = 0;
    $g = array();
    $j = 0;
    while($row = mysql_fetch_array($list))
    {
        $ok = true;
        foreach($g as $group)
            if($g == $row['tag_group'])
            {
                $ok = false;
                break;
            }
        if(!$ok)
            continue;
        $result[$i++] = $row[0];
        if($i == $num)
            break;
        if($row['tag_group']!=0)
            $g[$j++] ++;
    }
    return $result;
}

function theme_hot($num)
{
    $content = '<div id="hot">
                <div class="left-title">
                    <span class="left left-title-text">热门职位</span> <span class="right left-title-time">截止至'.date('Y.n.j').'</span>
                </div>
                <div id="hot-content">';
    $hots = get_hot(12);
    foreach($hots as $h)
        $content .= '<a class="left hot-content-item">'.$h['name'].'('.$h['count'].')</a>';
    $content .= '</div></div>';
    echo $content;
}
?>
