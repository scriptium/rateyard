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
</head>

<body>
    <?php
    $current = 'index';
    require $_SERVER['DOCUMENT_ROOT'] . '/../includes/student/header.php';
    // require $_SERVER['DOCUMENT_ROOT'] . '/../includes/preloader.php';
    ?>
    <div id="content">
        <a class="group_box" href="subject.php?id=1">
            <span class="subject_name">Алгебра</span>
        </a>
    </div>
    <script type="text/javascript" src="/static/js/rateyard_api_client.js"></script>
    <script type="text/javascript" src="/static/js/base.js"></script>
    <script type="text/javascript" src="/static/js/student/api.js"></script>
    <script type="text/javascript" src="/static/js/student/base.js"></script>
    <script type="text/javascript" src="/static/js/student/index.js"></script>
</body>

</html>