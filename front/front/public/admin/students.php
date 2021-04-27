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
    $current = 'students';
    require $_SERVER['DOCUMENT_ROOT'] . '/../includes/admin/header.php';
    require $_SERVER['DOCUMENT_ROOT'] . '/../includes/preloader.php';
    ?>
    <input type="file" id="students_data_file" name="file" accept=".xlsx, .xls" onchange="onFileInput(this.files)">
    <div id="content">
        <div class="title_block">
            <div class="title">Наявні учні</div>
            <a href="new_student.php">
                <div class="blue_button">
                    <div class="button_icon add_icon"></div>
                    <div>Додати учня</div>
                </div>
            </a>
            <div class="excel_button" onclick="excelButton()">
                <div class="button_icon excel_icon"></div>
                <div>Імпорт з файлу Microsoft Excel</div>
            </div>
        </div>
        <input type="text" class="default_input_text" placeholder="Пошук учнів" oninput="searchStudents(this.value)">
        <table class="default_table" id="students_table">
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
    <template id="imported_students_content">
        <div id="content">
            <div class="title">Імпорт учнів</div>
            <div class="input_grid">
                <div>Випадковий пароль для кожного учня:</div>
                <select class="default_select" id="use_random_password">
                    <option value="true">Так</option>
                    <option value="false" selected>Ні</option>
                </select>
                <div class="hide_on_random_password">Пароль учнів:</div>
                <input id="students_password" type="text" class="default_input_text hide_on_random_password"
                placeholder="Введіть новий пароль учнів">
            </div>
            <a class="blue_button" id="download_passwords">
                <div>Завантижити файл з паролями</div>
            </a>
            <table class="default_table" id="imported_students_table">
                <thead>
                    <tr>
                        <th>ПІБ</th>
                        <th>Клас</th>
                        <th>Логін</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
            <div class="blue_button" onclick="saveImportedStudents()">
                <div class="button_icon save_icon"></div>
                <div>Зберегти</div>
            </div>
        </div>
    </template>

    <script type="text/javascript" src="/static/js/base.js"></script>
    <script type="text/javascript" src="/static/js/admin/base.js"></script>
    <script type="text/javascript" src="/static/js/rateyard_api_client.js"></script>
    <script type="text/javascript" src="/static/js/admin/api.js"></script>
    <script src="https://cdn.jsdelivr.net/gh/nextapps-de/flexsearch@master/dist/flexsearch.light.js"></script>
    <script type="text/javascript" src="/static/js/hidable_children_element.js"></script>
    <script type="text/javascript" src="/static/js/admin/students.js"></script>
</body>

</html>