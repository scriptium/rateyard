<?php
if (!array_key_exists('id', $_GET) || !is_numeric($_GET['id'])) {
    http_response_code(404);
    exit;
}
?>

<!DOCTYPE html>
<html lang="ua">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/static/css/base.css">
    <link rel="stylesheet" href="/static/css/admin/base.css">
    <link rel="stylesheet" href="/static/css/header.css">
    <title>Наявні учні</title>
</head>

<body>
    <?php
    $current = 'groups';
    require $_SERVER['DOCUMENT_ROOT'] . '/../includes/admin/header.php';
    require $_SERVER['DOCUMENT_ROOT'] . '/../includes/preloader.php';
    ?>
    <div id="content">
        <div class="title_block">
            <div class="title">Налаштування групи №<span id="group_id"><?php echo $_GET['id']; ?></span></div>
            <div class="delete_button" onclick="deleteGroupButton(this)">
                <div class="button_icon delete_icon"></div>
                <div>Видалити</div>
            </div>
            <div class="appear_on_change appear_transition title_block">
                <div class="blue_button" onclick="saveGroupChanges(this)">
                    <div class="button_icon save_icon"></div>
                    <div>Зберегти зміни</div>
                </div>
                <div class="blue_button" onclick="changesSet.discardChanges()">
                    <div class="button_icon back_icon"></div>
                    <div>Прибрати зміни</div>
                </div>
            </div>
        </div>
        <div class="input_grid">
            <div>Назва:</div><input id="name" type="text" class="default_input_text" placeholder="Введіть назву групи" oninput="changesSet.updateChangedElements(this)">
            <div>Клас:</div>
            <div id="class_id"></div>
        </div>
        <div class="subtitle">Склад групи:</div>
        <table class="default_table" id="group_students">
            <thead>
                <tr>
                    <th>№</th>
                    <th>ПІБ</th>
                    <th>Логін</th>
                    <th>Адреса електронної пошти</th>
                    <th style="width: 25px;"></th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
        <div class="subtitle">Викладачі групи:</div>
        <div class="title_block">
            <div class="blue_button" onclick="">
                <div class="button_icon add_icon"></div>
                <div>Додати викладача</div>
            </div>
        </div>
        <table class="default_table" id="lecturers_table">
            <thead>
                <tr>
                    <th>№</th>
                    <th>ПІБ</th>
                    <th>Предмет</th>
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
    <script type="text/javascript" src="/static/js/admin/changes_set.js"></script>
    <script type="text/javascript" src="/static/js/admin/group.js"></script>
</body>

</html>