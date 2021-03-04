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
</head>

<body>
    <?php
    require $_SERVER['DOCUMENT_ROOT'] . '/../includes/teacher/header.php';
    require $_SERVER['DOCUMENT_ROOT'] . '/../includes/preloader.php';
    ?>
    <div id="content">
        <div class="title_block">
            <div class="title">Налаштування облікового запису</div>
            <div class="appear_on_change appear_transition">
                <div class="blue_button">
                    <div class="button_icon save_icon"></div>
                    <div>Зберегти</div>
                </div>
            </div>
        </div>
        <div class="input_grid">
            <div>ПІБ:</div><input id="full_name" type="text" class="default_input_text" placeholder="Введіть назву групи" oninput="changesSet.updateChangedElements(this)">
            <div>Логін:</div><input id="username" type="text" class="default_input_text" placeholder="Введіть назву групи" oninput="changesSet.updateChangedElements(this)">
            <div>Новий пароль:</div><input id="password" type="text" class="default_input_text" placeholder="Введіть назву групи" oninput="changesSet.updateChangedElements(this)">
        </div>
    </div>
    <script type="text/javascript" src="/static/js/rateyard_api_client.js"></script>
    <script type="text/javascript" src="/static/js/base.js"></script>
    <script type="text/javascript" src="/static/js/teacher/api.js"></script>
    <script type="text/javascript" src="/static/js/teacher/base.js"></script>
    <script type="text/javascript" src="/static/js/changes_set.js"></script>
    <script type="text/javascript" src="/static/js/teacher/account.js"></script>
</body>

</html>