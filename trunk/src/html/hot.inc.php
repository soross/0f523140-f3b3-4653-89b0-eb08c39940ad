<?php
include_once('common.inc.php');

func_register(array(
    'hot' => array(
        'callback' => 'deal_hot',
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
    $view = "SELECT tags.name,tags.count,tags.tag_group,tg.tag_group_name from tags,(SELECT * FROM tag_group) AS tg WHERE tg.tag_group = tags.tag_group ORDER BY tags.count DESC";
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
        if($row['tag_group']!=0)
            $name = $row['tag_group_name'];
        else
            $name = $row['name'];
        $row2 = array(
            'name' => $name,
            'count' => $row['count'],
        );
        $result[$i++] = $row2;
        if($i == $num)
            break;
        if($row['tag_group']!=0)
            $g[$j++] = $row['tag_group'];
    }
    return $result;
}

function hot_tag()
{
    $args = func_get_args();
    $key = $args[2];
    if($key == "0" or $key == "")
    {
        $content = '<div class="left-title">
                    <span class="left left-title-text">热门职位</span> <span class="right left-title-time">截止至'.date('Y.n.j').'</span>
                </div>
                <div id="hot-content">';
        $num = 20;
    }
    elseif($key == "1")
    {
        $content = '<span id="jobs-publish-tags-hot-title" class="left">热门标签</span>';
        $num = 10;
    }
    elseif($key == "2")
    {
        $content = '<span id="recruitment-publish-tags-hot-title" class="left">热门标签</span>';
        $num = 10;
    }
    else
        die("Invalid argument!");
    $hots = get_hot($num);
    foreach($hots as $h)
        if($key == "1")
            $content .= '<a class="left jobs-publish-tags-hot-item" title="'.$h['name'].'">'.$h['name'].'</a>';
        elseif($key == "2")
            $content .= '<a class="left recruitment-publish-tags-hot-item" title="'.$h['name'].'">'.$h['name'].'</a>';
        else
            $content .= '<a class="left hot-content-item" onclick="HotClick(\''.$h['name'].'\')">'.$h['name'].'('.$h['count'].')</a>';
    if($key == "0" or $key == "")
        $content .= '</div>';
    echo $content;
}

function hot_editgroup()
{
    include_once('login.inc.php');
    user_ensure_admin();
    connect_db();
    $view = "SELECT * FROM tags";
    $list = mysql_query($view);
    $content = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /></head><body><form action="/hot/groupupdate" method="post"><table>';
    while($row = mysql_fetch_array($list))
        $content .= "<tr><td>".$row['name']."</td><td><input type='text' name=".$row["tag_id"]." value=".$row['tag_group']." /></td></tr>";
    $content .= "<input type='submit' value='修改' /></form></table></body></html>";
    echo $content;
}

function hot_groupupdate()
{
    include_once('login.inc.php');
    user_ensure_admin();
    connect_db();
    $view = "SELECT tag_id FROM tags";
    $list = mysql_query($view);
    $set = array();
    while($row = mysql_fetch_array($list))
        $set[$row['tag_id']] = get_post($row['tag_id']);
    foreach($set as $tag_id => $tag_group)
    {
        $view = "UPDATE tags SET tag_group='$tag_group' WHERE tag_id='$tag_id'";
        $list = mysql_query($view);
    }
}
    
function hot_editname()
{
    include_once('login.inc.php');
    user_ensure_admin();
    connect_db();
    $view = "SELECT * FROM tag_group";
    $list = mysql_query($view);
    $content = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /></head><body><form action="/hot/nameupdate" method="post"><table>';
    while($row = mysql_fetch_array($list))
    {
        $content .= "<tr><td>".$row['tag_group_name']."</td><td>".$row['tag_group']."</td></tr>";
    }
    $content .= "</form></table></body></html>";
    echo $content;
}

function deal_hot($query)
{
    $key = (string) $query[1];
    if(!$key)
        die("Invalid Argument!");
    $function = 'hot_'.$key;
    if (!function_exists($function))
        die("Invalid Argument!");
    return call_user_func_array($function, $query);
}
?>
