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
    <?php require $_SERVER['DOCUMENT_ROOT'] . '/../includes/icons.php'; ?>
</head>

<body>
    <?php
    $current = 'index';
    require $_SERVER['DOCUMENT_ROOT'] . '/../includes/teacher/header.php';
    require $_SERVER['DOCUMENT_ROOT'] . '/../includes/preloader.php';
    ?>
    <div id="content">
    </div>
    <script type="text/javascript" src="/static/js/rateyard_api_client.js"></script>
    <script type="text/javascript" src="/static/js/base.js"></script>
    <script type="text/javascript" src="/static/js/teacher/api.js"></script>
    <script type="text/javascript" src="/static/js/teacher/base.js"></script>
    <script type="text/javascript" src="/static/js/teacher/index.js"></script>
</body>

</html>