<!DOCTYPE html>
<html lang="ua">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/static/css/base.css">
    <link rel="stylesheet" href="/static/css/admin/base.css">
    <link rel="stylesheet" href="/static/css/admin/header.css">
    <title>Наявні вчителі</title>
</head>

<body>
    <?php
    $current = 'teachers';
    require $_SERVER['DOCUMENT_ROOT'] . '/../includes/admin/header.php';
    ?>
    <div id="content">
        <div class="title_block">
            <div class="title">Наявні вчителі</div>
            <a href="new_teacher.php">
                <div class="blue_button">
                    <div class="button_icon add_icon"></div>
                    <div>Додати вчителя</div>
                </div>
            </a>
        </div>
        <input type="text" class="default_input_text" placeholder="Пошук вчителів" oninput="searchTeachers(this.value)">
        <table class="default_table appear_transition" id="teachers_table">
            <tbody>
                <tr>
                    <th>№</th>
                    <th>ПІБ</th> 
                    <th>Логін</th>
                    <th>Адреса електронної пошти</th>
                </tr>
            </tbody>
            <tbody>
            </tbody>
        </table>
    </div>
    <script type="text/javascript" src="/static/js/base.js"></script>
    <script type="text/javascript" src="/static/js/admin/base.js"></script>
    <script type="text/javascript" src="/static/js/rateyard_api_client.js"></script>
    <script type="text/javascript" src="/static/js/admin/api.js"></script>
    <script src="https://cdn.jsdelivr.net/gh/nextapps-de/flexsearch@master/dist/flexsearch.light.js"></script>
    <script type="text/javascript" src="/static/js/admin/hidable_children_element.js"></script>
    <script type="text/javascript" src="/static/js/admin/teachers.js"></script>
</body>

</html>