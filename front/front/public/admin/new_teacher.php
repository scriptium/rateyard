<!DOCTYPE html>
<html lang="ua">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/static/css/base.css">
    <link rel="stylesheet" href="/static/css/admin/base.css">
    <link rel="stylesheet" href="/static/css/admin/header.css">
    <title>Наявні вчителі</title>
</head>

<body>
    <?php
    $current = 'teachers';
    require $_SERVER['DOCUMENT_ROOT'] . '/../includes/admin/header.php';
    ?>
    <div id="content">
        <div class="title_block">
            <div class="title">Новий вчитель</div>
            <div class="blue_button" onclick="saveNewTeacherButton(this)">
                <div class="button_icon save_icon"></div>
                <div>Зберегти</div>
            </div>
        </div>
        <div id="load_data" class="input_grid appear_transition">
            <div>ПІБ:</div><input id="full_name" type="text" class="default_input_text" placeholder="Введіть ПІБ вчителя">
            <div>Логін:</div><input id="username" type="text" class="default_input_text" placeholder="Введіть логін вчителя">
            <div>Адреса електронної пошти:</div><input id="email" type="text" class="default_input_text"
                placeholder="Введіть адресу електронної пошти вчителя">
            <div>Новий пароль:</div><input id="password" type="text" class="default_input_text"
                placeholder="Введіть новий пароль вчителя">
        </div>
        <script type="text/javascript" src="/static/js/base.js"></script>
        <script type="text/javascript" src="/static/js/admin/base.js"></script>
        <script type="text/javascript" src="/static/js/rateyard_api_client.js"></script>
        <script type="text/javascript" src="/static/js/admin/api.js"></script>
        <script type="text/javascript" src="/static/js/admin/new_teacher.js"></script>
</body>

</html>