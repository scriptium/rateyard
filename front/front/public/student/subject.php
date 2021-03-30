<!DOCTYPE html>
<html lang="ua">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rateyard</title>
    <link rel="stylesheet" href="/static/css/base.css">
    <link rel="stylesheet" href="/static/css/header.css">
    <link rel="stylesheet" href="/static/css/teacher/base.css">
    <link rel="stylesheet" href="/static/css/teacher/index.css">
    <link rel="stylesheet" href="/static/css/student/index.css">
    <link rel="stylesheet" href="/static/css/student/marks.css">
</head>

<body>
    <?php
    $current = 'index';
    require $_SERVER['DOCUMENT_ROOT'] . '/../includes/student/header.php';
    // require $_SERVER['DOCUMENT_ROOT'] . '/../includes/preloader.php';
    ?>
    <div id="subjects">
        <a class='subject current' href="">
            <span class='subject_name'>Алгебра</span>
            <div class="notification notification-subject">12</div>
        </a>
        <a class='subject' href="subject.php?id=2">
            <span class='subject_name'>Фізика</span>
            <div class="notification notification-subject">1</div>
        </a>
    </div>

    <div id="marks">
        <div id="marks-header">Алгебра</div>
        <div class="mark-container" onclick="showComment(this)">
            <div class="mark-info">
                <div class="mark-title">Кр1</div>
                <div class="mark-date">16.01.2018</div>
            </div>
            <div class="mark">9</div>
            <div class="notification notification-mark"></div>
        </div>
        <div class="comment">
            Маєш негарний зошит!
        </div>
        <div class="mark-container" onclick="showComment(this)">
            <div class="mark-info">
                <div class="mark-title">Кр2</div>
                <div class="mark-date">17.01.2018</div>
            </div>
            <div class="mark">11</div>
            <div class="notification notification-mark"></div>
        </div>
        <div class="comment">
            Маєш поганий зошит!
        </div>
    </div>
    
    <script type="text/javascript" src="/static/js/rateyard_api_client.js"></script>
    <script type="text/javascript" src="/static/js/base.js"></script>
    <script type="text/javascript" src="/static/js/student/api.js"></script>
    <script type="text/javascript" src="/static/js/student/base.js"></script>
    <script type="text/javascript" src="/static/js/student/index.js"></script>
    <script type="text/javascript" src="/static/js/student/marks.js"></script>
</body>

</html>