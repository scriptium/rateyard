<?php
    if($user_type == 'student') {
        echo '<script type="text/javascript" src="/static/js/student/api.js"></script>';
    } else {
        echo '<script type="text/javascript" src="/static/js/teacher/api.js"></script>';
    }
?>