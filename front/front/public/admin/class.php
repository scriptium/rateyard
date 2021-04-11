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
    <title>Налаштування класу</title>
    <?php require $_SERVER['DOCUMENT_ROOT'] . '/../includes/icons.php'; ?>
</head>

<body>
    <?php
    $current = 'classes';
    require $_SERVER['DOCUMENT_ROOT'] . '/../includes/admin/header.php';
    require $_SERVER['DOCUMENT_ROOT'] . '/../includes/preloader.php';
    ?>
    <div id="content">
        <div class="title_block">
            <div class="title">Налаштування <span id="class_id" value="<?php echo $_GET['id']; ?>"></span> класу </div>
        </div>
        <div class="subtitle">Групи класу:</div>
        <div class="title_block">
            <a href="new_group.php">
                <div class="blue_button">
                    <div class="button_icon add_icon"></div>
                    <div>Додати групу</div>
                </div>
            </a>
        </div>
        <table class="default_table" id="groups_table">
            <thead>
                <tr>
                    <th>№</th>
                    <th>Назва</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
        <div class="subtitle">Викладачі класу:</div>
        <div class="title_block">
            <div class="blue_button" onclick="addNewLecturer(this)">
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
                    <th>Група</th>
                    <th style="width: 32px;"></th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        </table>

        <div class="subtitle">Наявні учні:</div>
        <div class="title_block">
            <a href="new_student.php?class=<?php echo $_GET['id']; ?>">
                <div class="blue_button">
                    <div class="button_icon add_icon"></div>
                    <div>Додати учня</div>
                </div>
            </a>
            <div class="delete_button" onclick="deleteAllStudents(this);">
                <div class="button_icon delete_icon"></div>
                <div>Видалити всіх учнів класу</div>
            </div>
            <div class="blue_button" id="move_students_button" onclick="moveAllStudents(this)">
                <div class="button_icon add_icon"></div>
                <div>Перемістити всіх учнів до</div>
            </div>
            <select id="classes_select" class="default_select"></select>
        </div>
        <table class="default_table" id="students_table">
            <thead>
                <tr>
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
    <script type="text/javascript" src="/static/js/changes_set.js"></script>
    <script type="text/javascript" src="/static/js/admin/class.js"></script>
</body>

</html>