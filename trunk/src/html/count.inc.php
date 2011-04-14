<?php
func_register(array(
    'count' => array(
        'callback' => 'count_show',
    ),
));

function count_show()
{
    $counts = get_counts();
    $r = $counts['tweets_thisweek'].','.$counts['tweets_today'];
    echo $r;
}
