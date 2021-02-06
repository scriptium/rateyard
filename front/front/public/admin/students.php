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
        <div id="title_block">
            <div class="title">Наявні учні</div>
            <a href="new_student.php">
                <div class="blue_button">
                    <div class="button_icon add_icon"></div>
                    <div>Додати учня</div>
                </div>
            </a>
            <div class="excel_button">
                <div class="button_icon excel_icon"></div>
                <div>Імпорт з файлу Microsoft Excel</div>
            </div>
        </div>
        <input type="text" class="default_input_text" placeholder="Пошук учнів">
        <table class="default_table hidden" id="students_table">
            <tbody>
                <tr>
                    <th>№</th>
                    <th>ПІБ</th>
                    <th>Клас</th>
                    <th>Логін</th>
                    <th>Адреса електронної пошти</th>
                </tr>
            </tbody>
            <tbody>
            </tbody>

        </table>
    </div>
    <script type="text/javascript" src="/static/js/admin/base.js"></script>
    <script type="text/javascript" src="/static/js/admin/api.js"></script>
    <script type="text/javascript" src="/static/js/admin/students.js"></script>
</body>

</html>