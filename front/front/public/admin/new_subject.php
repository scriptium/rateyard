<!DOCTYPE html>
<html lang="ua">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/static/css/base.css">
    <link rel="stylesheet" href="/static/css/admin/base.css">
    <link rel="stylesheet" href="/static/css/header.css">
    <title>Новий Предмет</title>
</head>

<body>
    <?php
    $current = 'subjects';
    require $_SERVER['DOCUMENT_ROOT'] . '/../includes/admin/header.php';
    ?>
    <div id="content">
        <div class="title_block">
            <div class="title">Новий Предмет</div>
            <div class="blue_button" onclick="saveNewSubjectButton(this)">
                <div class="button_icon save_icon"></div>
                <div>Зберегти</div>
            </div>
        </div>
        <div id="load_data" class="input_grid">
            <div>Назва предмету:</div><input id="subject_name" type="text" class="default_input_text" placeholder="Введіть Назву Предмету">
        </div>
    </div>
    <script type="text/javascript" src="/static/js/base.js"></script>
    <script type="text/javascript" src="/static/js/admin/base.js"></script>
    <script type="text/javascript" src="/static/js/rateyard_api_client.js"></script>
    <script type="text/javascript" src="/static/js/admin/api.js"></script>
    <script type="text/javascript" src="/static/js/admin/new_subject.js"></script>
</body>

</html>