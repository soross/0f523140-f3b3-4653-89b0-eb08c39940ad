<?php
function feedback_post($query)
{
    include_once('login.inc.php');
    if(user_is_authenticated())
    {
        $id1 = ', user_id';
        $id2 = ', \''.get_current_user_id().'\'';
    }
    else
        $id1 = $id2 = "";
    $question = $_POST['question'];
    $description = $_POST['description'];
    $email = $_POST['email'];
    include_once("uuid.inc.php");
    $v4uuid = str_replace("-", "", UUID::v4());
    connect_db();
    $add = "INSERT INTO feedback (
					 feedback_id, question, description, post_datetime, email$id1)
				     VALUES ('$v4uuid', '$question', '$description', '".date('Y-m-d H:i:s')."', '$email'$id2)";
    $added = mysql_query($add) or die("Could not add entry!");
    echo "0";
}

function get_feedbacks($num, $page)
{
    if(!$page)
        $page = "0";
    if($page == "count")
    {
        $limit = "";
        $select = "COUNT(*)";
    }
    else
    {
        $select = "*";
        $page = intval($page) * $num;
        $limit = " LIMIT $page , $num";
    }
    connect_db();
    $view = "SELECT $select from feedback, (SELECT nickname, user_id FROM userinfo) as ui WHERE ui.user_id = feedback.user_id OR feedback.user_id IS NULL AND feedback.feedback_id IS NOT NULL ORDER BY post_datetime DESC$limit";
    $list = mysql_query($view);
    $result = array();
    $i = 0;
    while($row = mysql_fetch_array($list))
        $result[$i++] = $row;
    return $result;
}

function feedback_show($query)
{
    $args = func_get_args();
    $key = $args[2];
    $content = '';
    $results = get_feedbacks(10, $key);
    if($key == "count")
    {
        echo $results[0][0];
        return;
    }
    foreach($results as $r)
    {
        if($r['user_id'])
            $nick = $r['nickname'];
        else
            $nick = "游客";
        $content .= '<div class="item" id="'.$r['feedback_id'].'">
                        <div class="item-delete">
                            <a class="right"></a>
                        </div>
                        <div class="left item-pic">
                            <img alt="" width="50" height="50">
                        </div>
                        <div class="left item-content">
                            <div class="item-blog">
                                <a class="item-blog-name">'.$nick.'</a><a class="item-blog-title">'.$r['question'].'</a>
                            </div>
                            <div class="item-blog-content close">
                                '.$r['description'].'
                            </div>
                            <div class="item-other">
                                <span class="left item-time">'.time_tran($r['post_datetime']).'</span>
                                <a class="left item-position">'.$r['email'].'</a>
                                <a class="right item-control last delete">删除</a>
                            </div>
                        </div>
                        <div class="clear">
                        </div>
                    </div>';
    }
    echo $content;
}
?>
