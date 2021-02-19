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
    <link rel="stylesheet" href="/static/css/admin/header.css">
    <title>Наявні учні</title>
</head>

<body>
    <?php
    $current = 'groups';
    require $_SERVER['DOCUMENT_ROOT'] . '/../includes/admin/header.php';
    ?>
    <div id="content">
        <div class="title_block">
            <div class="title">Налаштування групи №<span id="group_id"><?php echo $_GET['id']; ?></span></div>
            <div class="delete_button" onclick="deleteStudentButton(this)">
                <div class="button_icon delete_icon"></div>
                <div>Видалити</div>
            </div>
            <div class="appear_on_change appear_transition title_block">
                <div class="blue_button" onclick="saveGroupChangesButton(this)">
                    <div class="button_icon save_icon"></div>
                    <div>Зберегти зміни</div>
                </div>
                <div class="blue_button" onclick="discardGroupChangesButton()">
                    <div class="button_icon back_icon"></div>
                    <div>Прибрати зміни</div>
                </div>
            </div>
        </div>
        <div class="appear_after_group input_grid appear_transition">
            <div>Назва:</div><input id="name" type="text" class="default_input_text" placeholder="Введіть назву групи">
            <div>Клас:</div><select id="class_id" class="default_select" onchange="updateGroupStudentData()"></select>
        </div>
        <div class="subtitle appear_transition appear_after_group">Склад групи:</div>
        <table class="default_table appear_transition appear_after_group" id="group_students">
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
        <script type="text/javascript" src="/static/js/base.js"></script>
        <script type="text/javascript" src="/static/js/admin/base.js"></script>
        <script type="text/javascript" src="/static/js/admin/api.js"></script>
        <script type="text/javascript" src="/static/js/admin/group.js"></script>
</body>

</html>