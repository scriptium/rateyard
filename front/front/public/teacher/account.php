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
    <?php require $_SERVER['DOCUMENT_ROOT'] . '/../includes/icons.php'; ?>
</head>

<body>
    <?php
    require $_SERVER['DOCUMENT_ROOT'] . '/../includes/teacher/header.php';
    require $_SERVER['DOCUMENT_ROOT'] . '/../includes/preloader.php';
    ?>
    <div id="content">
        <div class="title_block">
            <div class="title">Налаштування облікового запису</div>
            <div class="blue_button" id="verify_email_button">
                <div>Підтвердити пошту</div>
            </div>
            <div class="appear_on_change appear_transition">
                <div class="blue_button" onclick="saveAccountChangesButton(this)">
                    <div class="button_icon save_icon"></div>
                    <div>Зберегти зміни</div>
                </div>
            </div>
        </div>
        <div class="input_grid">
            <div>ПІБ:</div><input id="full_name" type="text" class="default_input_text" placeholder="Введіть ПІБ" oninput="changesSet.updateChangedElements(this)">
            <div>Логін:</div><input id="username" type="text" class="default_input_text" placeholder="Введіть логін" oninput="changesSet.updateChangedElements(this)">
            <div>Адреса електронної пошти:</div><input id="email" type="text" class="default_input_text" placeholder="Введіть адресу електронної пошти" oninput="changesSet.updateChangedElements(this)">
            <div>Новий пароль:</div><input id="password" type="password" class="default_input_text" placeholder="Введіть новий пароль" oninput="changesSet.updateChangedElements(this)">
            <div>Блокувати сторінку:</div>
            <select class="default_select" onchange="changesSet.updateChangedElements(this)" id="block_after_minutes">
                <option value="0">Ніколи</option>
                <option value="1">Через 1 хвилину</option>
                <option value="2">Через 2 хвилини</option>
                <option value="3">Через 3 хвилини</option>
                <option value="5">Через 5 хвилин</option>
                <option value="10">Через 10 хвилин</option>
                <option value="15">Через 15 хвилин</option>
                <option value="20">Через 20 хвилин</option>
                <option value="25">Через 25 хвилин</option>
                <option value="30">Через 30 хвилин</option>
                <option value="45">Через 45 хвилин</option>
            </select>
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