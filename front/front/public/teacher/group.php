<!DOCTYPE html>
<html lang="ua">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rateyard</title>
    <link rel="stylesheet" href="/static/css/base.css">
    <link rel="stylesheet" href="/static/css/header.css">
    <link rel="stylesheet" href="/static/css/teacher/base.css">
    <link rel="stylesheet" href="/static/css/teacher/group.css">
</head>

<body>
    <?php
    require $_SERVER['DOCUMENT_ROOT'] . '/../includes/teacher/header.php';
    require $_SERVER['DOCUMENT_ROOT'] . '/../includes/preloader.php';
    ?>
    <div id="content">
        <div id="group_title" class="title"></div>
        <div id="group_subtitle" class="subtitle"></div>
        <div id="tools">
            <div id="column_tool">
                <div class="input_container">
                    <span>Дата:</span>
                    <input type="date" class="default_input_text" style="width: 150px;">
                </div>
                <div class="stretched input_container">
                    <span>Назва:</span>
                    <input type="text" class="default_input_text" placeholder="Введіть назву колонки">
                </div>
                <div class="blue_button">
                    <div class="button_icon save_icon"></div>
                    <div>Зберегти колонку</div>
                </div>
                <div class="blue_button">
                    <div class="button_icon back_icon"></div>
                    <div>Скасувати</div>
                </div>
            </div>
            <div id="mark_tool">
                <div class="input_container">
                    <span>Оцінка:</span>
                    <input type="text" size="2" maxlength="2" class="default_input_text">
                </div>
                <div class="stretched input_container">
                    <span>Кометар учню:</span>
                    <input type="text" class="default_input_text" placeholder="Введіть кометар учню (необов'язково)">
                </div>
                <div class="blue_button">
                    <div class="button_icon save_icon"></div>
                    <div>Зберегти оцінку</div>
                </div>
                <div class="blue_button">
                    <div class="button_icon back_icon"></div>
                    <div>Скасувати</div>
                </div>
            </div>
        </div>
        <div id="marks_table">
        </div>
    </div>
    <script type="text/javascript" src="/static/js/rateyard_api_client.js"></script>
    <script type="text/javascript" src="/static/js/base.js"></script>
    <script type="text/javascript" src="/static/js/teacher/api.js"></script>
    <script type="text/javascript" src="/static/js/teacher/base.js"></script>
    <script type="text/javascript" src="/static/js/teacher/group.js"></script>
</body>

</html>