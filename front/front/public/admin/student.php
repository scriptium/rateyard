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
    $current = 'students';
    require $_SERVER['DOCUMENT_ROOT'] . '/../includes/admin/header.php';
    ?>
    <div id="content">
        <div class="title_block">
            <div class="title">Налаштування учня №<span id="student_id"><?php echo $_GET['id']; ?></span></div>
            <div class="delete_button" onclick="deleteStudentButton(this)">
                <div class="button_icon delete_icon"></div>
                <div>Видалити</div>
            </div>
            <div class="appear_on_change appear_transition title_block">
                <div class="blue_button" onclick="saveStudentChangesButton(this)">
                    <div class="button_icon save_icon"></div>
                    <div>Зберегти зміни</div>
                </div>
                <div class="blue_button" onclick="changesSet.discardChanges()">
                    <div class="button_icon back_icon"></div>
                    <div>Прибрати зміни</div>
                </div>
            </div>
        </div>
        <div id="load_data" class="input_grid appear_transition">
            <div>ПІБ:</div><input id="full_name" type="text" class="default_input_text" placeholder="Введіть ПІБ учня" oninput="changesSet.updateChangedElements(this)">
            <div>Клас:</div><select id="class_id" class="default_select" onchange="changesSet.updateChangedElements(this)"></select>
            <div>Логін:</div><input id="username" type="text" class="default_input_text" placeholder="Введіть логін учня" oninput="changesSet.updateChangedElements(this)">
            <div>Адреса електронної пошти:</div><input id="email" type="text" class="default_input_text" placeholder="Введіть адресу електронної пошти учня" oninput="changesSet.updateChangedElements(this)">
            <div>Новий пароль:</div><input id="password" type="text" class="default_input_text" placeholder="Введіть новий пароль учня" oninput="changesSet.updateChangedElements(this)" initial_value="">
        </div>
        <div class="subtitle appear_transition appear_after_student_groups">Групи учня:</div>
        <table class="default_table appear_transition appear_after_student_groups" id="student_groups">
            <thead>
                <tr>
                    <th>№</th>
                    <th>Назва</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
        <script type="text/javascript" src="/static/js/base.js"></script>
        <script type="text/javascript" src="/static/js/admin/base.js"></script>
        <script type="text/javascript" src="/static/js/rateyard_api_client.js"></script>
        <script type="text/javascript" src="/static/js/admin/api.js"></script>
        <script type="text/javascript" src="/static/js/admin/changes_set.js"></script>
        <script type="text/javascript" src="/static/js/admin/student.js"></script>
</body>

</html>