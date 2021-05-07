<!DOCTYPE html>
<html lang="ua">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/static/css/base.css">
    <link rel="stylesheet" href="/static/css/admin/base.css">
    <link rel="stylesheet" href="/static/css/header.css">
    <title>Редагування предмету</title>
    <?php require $_SERVER['DOCUMENT_ROOT'] . '/../includes/icons.php'; ?>
</head>

<body>
    <?php
    $current = 'teachers';
    require $_SERVER['DOCUMENT_ROOT'] . '/../includes/admin/header.php';
    require $_SERVER['DOCUMENT_ROOT'] . '/../includes/preloader.php';
    ?>
    <div id="content">
        <div class="title_block">
            <div class="title">Налаштування предмету №<span id="subject_id"></span></div>
            <div class="delete_button" id="delete_subject">
                <div class="button_icon delete_icon"></div>
                <div>Видалити</div>
            </div>
            <div class="appear_on_change appear_transition title_block">
                <div class="blue_button" id="save_changes">
                    <div class="button_icon save_icon"></div>
                    <div>Зберегти зміни</div>
                </div>
                <div class="blue_button" id="discard_changes">
                    <div class="button_icon back_icon"></div>
                    <div>Прибрати зміни</div>
                </div>
            </div>
        </div>
        <div class="input_grid">
            <div>Назва:</div><input id="subject_name" type="text" class="default_input_text" placeholder="Введіть назву предмету">
        </div>

        <script type="text/javascript" src="/static/js/base.js"></script>
        <script type="text/javascript" src="/static/js/admin/base.js"></script>
        <script type="text/javascript" src="/static/js/rateyard_api_client.js"></script>
        <script type="text/javascript" src="/static/js/admin/api.js"></script>
        <script type="text/javascript" src="/static/js/changes_set.js"></script>
        <script type="text/javascript" src="/static/js/admin/subject.js"></script>
</body>

</html>