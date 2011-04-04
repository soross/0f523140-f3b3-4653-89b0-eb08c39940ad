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
        foreach($g as $_g)
            if($_g == $row['tag_group'])
            {
                $ok = false;
                break;
            }
        if(!$ok)
            continue;
        $result[$i++] = $row;
        if($i == $num)
            break;
        if($row['tag_group']!=0)
            $g[$j++] = $row['tag_group'];
    }
    return $result;
}

function theme_hot($query)
{
    $key = (string) $query[1];
    if($key == "0" or $key == "")
        $content = '<div id="hot">
                <div class="left-title">
                    <span class="left left-title-text">热门职位</span> <span class="right left-title-time">截止至'.date('Y.n.j').'</span>
                </div>
                <div id="hot-content">';
    elseif($key == "1")
        $content = '<span id="jobs-publish-tags-hot-title" class="left">热门标签</span>';
    elseif($key == "2")
        $content = '<span id="recruitment-publish-tags-hot-title" class="left">热门标签</span>';
    else
        die("Invalid argument!");
    $hots = get_hot(20);
    foreach($hots as $h)
        if($key == "1")
            $content .= '<a class="left jobs-publish-tags-hot-item" title="'.$h['name'].'">'.$h['name'].'</a>';
        elseif($key == "2")
            $content .= '<a class="left recruitment-publish-tags-hot-item" title="'.$h['name'].'">'.$h['name'].'</a>';
        else
            $content .= '<a class="left hot-content-item">'.$h['name'].'('.$h['count'].')</a>';
    if($key == "0" or $key == "")
        $content .= '</div></div>';
    echo $content;
}


?>
