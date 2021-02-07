<!DOCTYPE html>
<html lang="ua">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/static/css/base.css">
    <link rel="stylesheet" href="/static/css/admin/base.css">
    <link rel="stylesheet" href="/static/css/admin/header.css">
    <title>Наявні учні</title>
</head>

<body>
    <?php
    $current = 'students';
    require $_SERVER['DOCUMENT_ROOT'] . '/../includes/admin/header.php';
    ?>
    <div id="content">
        <div id="title_block">
            <div class="title">Новий учень</div>
            <div class="blue_button">
                <div class="button_icon save_icon"></div>
                <div>Зберегти</div>
            </div>
        </div>
        <div class="input_grid appear_transition">
            <div>ПІБ:</div><input type="text" class="default_input_text" placeholder="Введіть ПІБ учня">
            <div>Клас:</div><select id="classes_select" class="default_select"></select>
            <div>Логін:</div><input type="text" class="default_input_text" placeholder="Введіть логін">
            <div>Адреса електронної пошти:</div><input type="text" class="default_input_text"
                placeholder="Введіть адресу електронної пошти учня">
            <div>Новий пароль:</div><input type="text" class="default_input_text"
                placeholder="Введіть новий пароль учня">
        </div>
        <script type="text/javascript" src="/static/js/admin/base.js"></script>
        <script type="text/javascript" src="/static/js/admin/api.js"></script>
        <script type="text/javascript" src="/static/js/admin/new_student.js"></script>
</body>

</html>