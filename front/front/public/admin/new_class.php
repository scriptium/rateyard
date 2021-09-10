<!DOCTYPE html>
<html lang="ua">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/static/css/base.css">
    <link rel="stylesheet" href="/static/css/admin/base.css">
    <link rel="stylesheet" href="/static/css/header.css">
    <title>Додати клас</title>
    <?php require $_SERVER['DOCUMENT_ROOT'] . '/../includes/icons.php'; ?>
</head>

<body>
    <?php
    $current = 'classes';
    require $_SERVER['DOCUMENT_ROOT'] . '/../includes/admin/header.php';
    ?>
    <div id="content">
        <div class="title_block">
            <div class="title">Новий клас</div>
            <div class="title_block">
            </div>
            <div class="blue_button" onclick="saveNewClassButton(this)">
                <div class="button_icon save_icon"></div>
                <div>Зберегти</div>
            </div>
        </div>
        <div class="appear_after_classes input_grid">
            <div>Назва:</div><input id="name" type="text" class="default_input_text" placeholder="Введіть назву класу">
        </div>
    </div>
    <script type="text/javascript" src="/static/js/base.js"></script>
    <script type="text/javascript" src="/static/js/admin/base.js"></script>
    <script type="text/javascript" src="/static/js/rateyard_api_client.js"></script>
    <script type="text/javascript" src="/static/js/admin/api.js"></script>
    <script type="text/javascript" src="/static/js/changes_set.js"></script>
    <script type="text/javascript" src="/static/js/admin/new_class.js"></script>
</body>

</html>