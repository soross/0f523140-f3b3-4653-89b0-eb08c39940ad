<?php
func_register(array(
    'resume' => array(
        'callback' => 'deal_resume',
        'security' => 'true',
    ),
));

function resume_add()
{
    include_once('login.php');
    include_once("uuid.inc.php");
    #$resume_id = str_replace("-", "", UUID::v4());
    
    $user_id = get_current_user_id();
    $resume_id = $user_id;
    $name = $_POST['name'];
    $sex = $_POST['sex'];
    $date_birth = $_POST['date_birth'];
    $live_in_now = $_POST['live_in_now'];
    $live_in = $_POST['live_in'];
    $cellphone = $_POST['cellphone'];
    $email = $_POST['email'];
    $content = $_POST['content'];
    
    connect_db();
    $view = "SELECT * FROM resumes WHERE resume_id = '$resume_id'";
    $list = mysql_query($view);
    $row = mysql_fetch_array($list);
    if($row)
    {
        $view = "UPDATE resumes SET name='$name', sex='$sex', date_birth='$date_birth', live_in_now='$live_in_now', live_in='$live_in', cellphone='$cellphone', email='$email', content='$content' WHERE resume_id = '$resume_id'";
        $list = mysql_query($view) or die("Update error!");
    }
    else
    {
        $view = "INSERT INTO resumes(user_id, resume_id, name, sex, date_birth, live_in_now, live_in, cellphone, email, content) VALUES('$user_id','$resume_id','$name','$sex','$date_birth','$live_in_now','$live_in','$cellphone','$email','$content')";
        $list = mysql_query($view) or die("Update error!");
    }
}

function resume_show()
{
    $args = func_get_args();
    $key = $args[2];
    include_once('login.php');
    $id = get_current_user_id();
    if(!$key)
    {
        $key = $id;
        $theme = "resumeapi";
    }
    else
        $theme = "resume";
    connect_db();
    $view = "SELECT * FROM resumes WHERE resume_id = '$key'";
    $list = mysql_query($view);
    $row = mysql_fetch_array($list);
    if($row)
    {
        $_id = $row['user_id'];
        $view = "SELECT * FROM tweets AS t, (SELECT * FROM applications WHERE deleted = 0 AND resume_id = '$key') AS ap, (SELECT * from accountbindings WHERE user_id = '$id') AS ac WHERE t.deleted = 0 AND ap.tweet_id = t.tweet_id AND t.user_site_id = ac.user_site_id AND t.site_id = ac.site_id";
        $list = mysql_query($view);
        $row = mysql_fetch_array($list);
        if($row or $id == $_id)
        {
            if($row)
            {
                $view = "UPDATE applications SET view_time = '".date('Y-m-d H:i:s')."' WHERE resume_id = '$key' AND tweet_id = '".$row['tweet_id']."' AND user_id = '$_id'";
                $list = mysql_query($view);
            }
            $view = "SELECT * FROM resumes WHERE resume_id = '$key'";
            $list = mysql_query($view);
            $row = mysql_fetch_array($list);
            theme($theme, $row);
        }
        else
            die("Not authorized");
    }
    else
        die("Resume not found");
}

function theme_resumeapi($data)
{
    $content =       $data[0]['name'].'|'.$data[0]['sex'].'|'.$data[0]['date_birth']
                .'|'.$data[0]['live_in_now'].'|'.$data[0]['live_in'].'|'.$data[0]['cellphone']
                .'|'.$data[0]['email'].'|'.$data[0]['content']
    echo $content;
}

function deal_resume($query)
{
    $key = (string) $query[1];
    if(!$key)
        die("Invalid Argument!");
    $function = 'resume_'.$key;
    if (!function_exists($function))
        die("Invalid Argument!");
    return call_user_func_array($function, $query);
}

?>
