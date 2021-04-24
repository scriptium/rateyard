<!DOCTYPE html>
<html lang="ua">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/static/css/base.css">
    <link rel="stylesheet" href="/static/css/admin/base.css">
    <link rel="stylesheet" href="/static/css/header.css">
    <title>Наявні учні</title>
    <?php require $_SERVER['DOCUMENT_ROOT'] . '/../includes/icons.php'; ?>
</head>

<body>
    <?php
    $current = 'groups';
    require $_SERVER['DOCUMENT_ROOT'] . '/../includes/admin/header.php';
    require $_SERVER['DOCUMENT_ROOT'] . '/../includes/preloader.php';
    ?>
    <div id="content">
        <div class="title_block">
            <div class="title">Нова група</div>
            <div class="blue_button" onclick="saveNewGroupButton(this)">
                <div class="button_icon save_icon"></div>
                <div>Зберегти</div>
            </div>
        </div>
        <div class="appear_after_classes input_grid">
            <div>Назва:</div><input id="name" type="text" class="default_input_text" placeholder="Введіть назву групи">
            <div id="class_block">Клас:</div>
        </div>
        <div class="subtitle">Склад групи:</div>
        <table class="default_table" id="group_students">
            <thead>
                <tr>
                    <th style="width: 25px;"></th>
                    <th>№</th>
                    <th>ПІБ</th>
                    <th>Логін</th>
                    <th>Адреса електронної пошти</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
    </div>
    <script type="text/javascript" src="/static/js/base.js"></script>
    <script type="text/javascript" src="/static/js/admin/base.js"></script>
    <script type="text/javascript" src="/static/js/rateyard_api_client.js"></script>
    <script type="text/javascript" src="/static/js/admin/api.js"></script>
    <script type="text/javascript" src="/static/js/admin/new_group.js"></script>
</body>

</html>