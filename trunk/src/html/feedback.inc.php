<?php
func_register(array(
    'feedback' => array(
        'callback' => 'post_feedback',
    ),
));

function post_feedback($query)
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
					 feedback_id, question, description, email$id1)
				     VALUES ('$v4uuid', '$question', '$description', '$email'$id2)";
    $added = mysql_query($add) or die("Could not add entry!");
    echo "0";
}
?>
