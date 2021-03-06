<!DOCTYPE html>
<html lang="ua">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/static/css/base.css">
    <link rel="stylesheet" href="/static/css/admin/base.css">
    <link rel="stylesheet" href="/static/css/header.css">
    <title>Новий викладач</title>
</head>

<body>
    <?php
    require $_SERVER['DOCUMENT_ROOT'] . '/../includes/admin/header.php';
    require $_SERVER['DOCUMENT_ROOT'] . '/../includes/preloader.php';
    ?>
    <div id="content">
        <div class="title_block">
            <div class="title">Новий викладач</div>
            <div class="blue_button" onclick="saveNewLecturerButton(this)">
                <div class="button_icon save_icon"></div>
                <div>Зберегти</div>
            </div>
        </div>
        <div id="load_data" class="input_grid">
            <div>Клас:</div><div id="class_name" class="fake_readonly_input"></div>
            <div>Група:</div><div id="group_name" class="fake_readonly_input"></div>
            <div>Предмет:</div><select id="subject_select" class="default_select"></select>
            <div>Вчитель:</div><select id="teacher_select" class="default_select"></select>
        </div>
        <script type="text/javascript" src="/static/js/base.js"></script>
        <script type="text/javascript" src="/static/js/admin/base.js"></script>
        <script type="text/javascript" src="/static/js/rateyard_api_client.js"></script>
        <script type="text/javascript" src="/static/js/admin/api.js"></script>
        <script type="text/javascript" src="/static/js/changes_set.js"></script>
        <script type="text/javascript" src="/static/js/admin/new_lecturer.js"></script>
</body>

</html>