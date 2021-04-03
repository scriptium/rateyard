<!DOCTYPE html>
<html lang="ua">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rateyard</title>
    <link rel="stylesheet" href="/static/css/base.css">
    <link rel="stylesheet" href="/static/css/header.css">
    <link rel="stylesheet" href="/static/css/student/base.css">
    <link rel="stylesheet" href="/static/css/student/subject.css">
</head>

<body>
    <?php
    $current = 'index';
    require $_SERVER['DOCUMENT_ROOT'] . '/../includes/student/header.php';
    // require $_SERVER['DOCUMENT_ROOT'] . '/../includes/preloader.php';
    ?>
    <div id="content">
        <div id="marks">
            <div id="marks-header">Алгебра</div>
        </div>
    </div>

    <template id="mark_template">
        <div class="mark-container">
            <div class="mark_info"></div>
            <div class="mark">
                <div></div>
            </div>
        </div>
    </template>
    
    <script type="text/javascript" src="/static/js/rateyard_api_client.js"></script>
    <script type="text/javascript" src="/static/js/base.js"></script>
    <script type="text/javascript" src="/static/js/student/api.js"></script>
    <script type="text/javascript" src="/static/js/student/base.js"></script>
    <script type="text/javascript" src="/static/js/student/marks.js"></script>
</body>

</html>