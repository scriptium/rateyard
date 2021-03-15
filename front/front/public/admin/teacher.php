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
    <title>Редагування вчителя</title>
</head>

<body>
    <?php
    $current = 'teachers';
    require $_SERVER['DOCUMENT_ROOT'] . '/../includes/admin/header.php';
    require $_SERVER['DOCUMENT_ROOT'] . '/../includes/preloader.php';
    ?>
    <div id="content">
        <div class="title_block">
            <div class="title">Налаштування вчителя №<span id="teacher_id"><?php echo $_GET['id']; ?></span></div>
            <div class="delete_button" onclick="deleteTeacherButton(this)">
                <div class="button_icon delete_icon"></div>
                <div>Видалити</div>
            </div>
            <div class="appear_on_change appear_transition title_block">
                <div class="blue_button" onclick="saveTeacherChangesButton(this)">
                    <div class="button_icon save_icon"></div>
                    <div>Зберегти зміни</div>
                </div>
                <div class="blue_button" onclick="changesSet.discardChanges()">
                    <div class="button_icon back_icon"></div>
                    <div>Прибрати зміни</div>
                </div>
            </div>
        </div>
        <div id="load_data" class="input_grid">
            <div>ПІБ:</div><input id="full_name" type="text" class="default_input_text" placeholder="Введіть ПІБ вчителя" oninput="changesSet.updateChangedElements(this)">
            <div>Логін:</div><input id="username" type="text" class="default_input_text" placeholder="Введіть логін вчителя" oninput="changesSet.updateChangedElements(this)">
            <div>Адреса електронної пошти:</div><input id="email" type="text" class="default_input_text" placeholder="Введіть адресу електронної пошти вчителя" oninput="changesSet.updateChangedElements(this)">
            <div>Новий пароль:</div><input id="password" type="text" class="default_input_text" placeholder="Введіть новий пароль вчителя" oninput="changesSet.updateChangedElements(this)" initial_value="">
        </div>
        <div class="subtitle">Групи у яких викладає вчитель:</div>
        <div class="title_block">
            <div class="blue_button" onclick="addGroup(this)">
                <div class="button_icon add_icon"></div>
                <div>Додати групу</div>
            </div>
        </div>
        <table class="default_table" id="groups_table">
            <thead>
                <tr>
                    <th>№</th>
                    <th>Назва</th>
                    <th>Клас</th>
                    <th>Предмет</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        </table>

        <script type="text/javascript" src="/static/js/base.js"></script>
        <script type="text/javascript" src="/static/js/admin/base.js"></script>
        <script type="text/javascript" src="/static/js/rateyard_api_client.js"></script>
        <script type="text/javascript" src="/static/js/admin/api.js"></script>
        <script type="text/javascript" src="/static/js/changes_set.js"></script>
        <script type="text/javascript" src="/static/js/admin/teacher.js"></script>
</body>

</html>