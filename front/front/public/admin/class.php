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
</head>

<body>
    <?php
    $current = 'classes';
    require $_SERVER['DOCUMENT_ROOT'] . '/../includes/admin/header.php';
    require $_SERVER['DOCUMENT_ROOT'] . '/../includes/preloader.php';
    ?>
    <div id="content">
        <div class="title_block">
            <div class="title">Налаштування <span id="class_id"><?php echo $_GET['id']; ?></span> класу </div>
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
                    <th width="150px"></th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
        <div class="subtitle">Викладачі класу:</div>
        <div class="title_block">
            <a href="new_teacher.php">
                <div class="blue_button">
                    <div class="button_icon add_icon"></div>
                    <div>Додати вчителя</div>
                </div>
            </a>
        </div>
        <table class="default_table" id="lecturers_table">
            <thead>
                <tr>
                    <th>№</th>
                    <th>ПІБ</th>
                    <th>Предмет</th>
                    <th>Група</th>
                    <th style="width: 25px;"></th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        </table>

        <div class="subtitle">Наявні учні:</div>
        <div class="title_block">

            <a href="new_student.php">
                <div class="blue_button">
                    <div class="button_icon add_icon"></div>
                    <div>Додати учня</div>
                </div>
            </a>
            <div class="delete_button" onclick="deleteAllStudents(this);">
                <div class="button_icon delete_icon"></div>
                <div>Видалити всіх учнів класу</div>
            </div>
            <div class="blue_button">
                <div class="button_icon add_icon"></div>
                <div>Перемістити всіх учнів до</div>
            </div>
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
    <script type="text/javascript" src="/static/js/admin/changes_set.js"></script>
    <script type="text/javascript" src="/static/js/admin/class.js"></script>
</body>

</html>