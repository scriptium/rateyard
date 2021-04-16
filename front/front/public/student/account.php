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
    <link rel="stylesheet" href="/static/css/student/account_mobile.css">
    <?php require $_SERVER['DOCUMENT_ROOT'] . '/../includes/icons.php'; ?>
</head>

<body>
    <?php
    require $_SERVER['DOCUMENT_ROOT'] . '/../includes/student/header.php';
    require $_SERVER['DOCUMENT_ROOT'] . '/../includes/preloader.php';
    ?>
    <div id="content">
        <div class="title_block">
            <div class="title">Налаштування облікового запису</div>
            <div class="appear_on_change appear_transition" id="save_button">
                <div class="blue_button" onclick="saveAccountChangesButton(this)">
                    <div class="button_icon save_icon"></div>
                    <div>Зберегти зміни</div>
                </div>
            </div>
        </div>
        <div class="input_grid">
            <div>Адреса електронної пошти:</div><input id="email" type="text" class="default_input_text" placeholder="Введіть адресу електронної пошти" oninput="changesSet.updateChangedElements(this)">
            <div>Новий пароль:</div><input id="password" type="password" class="default_input_text" placeholder="Введіть новий пароль" oninput="changesSet.updateChangedElements(this)">
        </div>
    </div>
    <script type="text/javascript" src="/static/js/rateyard_api_client.js"></script>
    <script type="text/javascript" src="/static/js/base.js"></script>
    <script type="text/javascript" src="/static/js/student/api.js"></script>
    <script type="text/javascript" src="/static/js/student/base.js"></script>
    <script type="text/javascript" src="/static/js/changes_set.js"></script>
    <script type="text/javascript" src="/static/js/student/account.js"></script>
</body>

</html>