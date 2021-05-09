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
            <div class="title">Налаштування класу №<span id="class_id"><?php echo $_GET['id']; ?></span></div>
            <div class="delete_button" id="delete_class">
                <div class="button_icon delete_icon"></div>
                <div>Видалити</div>
            </div>
            <div class="appear_transition appear_on_change title_block">
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
            <div>Назва:</div>
            <input id="name" type="text" class="default_input_text" placeholder="Введіть назву класу" oninput="changesSet.updateChangedElements(this)" />
        </div>
        <div class="subtitle">Групи класу:</div>
        <div class="title_block">
            <div class="blue_button" onclick="addGroup(this);">
                <div class="button_icon add_icon"></div>
                <div>Додати групу</div>
            </div>
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
            <div class="blue_button" onclick="addStudent(this);">
                <div class="button_icon add_icon"></div>
                <div>Додати учня</div>
            </div>
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