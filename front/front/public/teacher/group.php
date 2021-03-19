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
        <div id="toolbar">
            <div>
                <div id="group_title" class="title"></div>
                <div id="group_subtitle" class="title"></div>
            </div>
            <div id="tools">
                <div id="default_tool">
                    <div class="blue_button" onclick="changeTool(prepareColumToolElement())">
                        <div class="button_icon add_icon"></div>
                        <div>Додати колонку</div>
                    </div>
                </div>
                <div id="column_tool" class="hidden">
                    <div class="input_container">
                        <span>Дата:</span>
                        <input type="date" class="default_input_text" id="column_date">
                    </div>
                    <div class="stretched input_container">
                        <span>Назва:</span>
                        <input type="text" class="default_input_text" placeholder="Введіть назву колонки" id="column_name">
                    </div>
                    <div class="blue_button" id="save_column_button">
                        <div class="button_icon save_icon"></div>
                        <div>Зберегти</div>
                    </div>
                    <div class="blue_button" onclick="changeTool(defaultToolElement);unfocusAll()">
                        <div class="button_icon back_icon"></div>
                        <div>Скасувати</div>
                    </div>
                    <div class="delete_button" onclick="deleteColumnButton()">
                        <div class="button_icon delete_icon"></div>
                        <div>Видалити</div>
                    </div>
                </div>
                <div id="mark_tool" class="hidden">
                    <div class="input_container">
                        <span>Оцінка:</span>
                        <input type="text" size="2" maxlength="2" id="mark_points" class="default_input_text">
                    </div>
                    <div class="stretched input_container">
                        <span>Кометар учню:</span>
                        <input type="text" class="default_input_text" id="mark_comment" placeholder="Введіть кометар учню">
                    </div>
                    <div class="blue_button">
                        <div class="button_icon save_icon"></div>
                        <div>Зберегти оцінку</div>
                    </div>
                    <div class="blue_button" onclick="changeTool(defaultToolElement);unfocusAll()">
                        <div class="button_icon back_icon"></div>
                        <div>Скасувати</div>
                    </div>
                    <div class="delete_button"  onclick="deleteMarkButton()">
                        <div class="button_icon delete_icon"></div>
                        <div>Видалити</div>
                    </div>
                </div>
            </div>
        </div>
        <table id="marks_table">
            <thead>
                <tr>
                    <th>ПІБ учня</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
    </div>
    <script type="text/javascript" src="/static/js/rateyard_api_client.js"></script>
    <script type="text/javascript" src="/static/js/base.js"></script>
    <script type="text/javascript" src="/static/js/teacher/api.js"></script>
    <script type="text/javascript" src="/static/js/teacher/base.js"></script>
    <script src="https://unpkg.com/@popperjs/core@2/dist/umd/popper.min.js"></script>
    <script src="https://unpkg.com/tippy.js@6/dist/tippy-bundle.umd.js"></script>
    <script type="text/javascript" src="/static/js/hidable_children_element.js"></script>
    <script type="text/javascript" src="/static/js/teacher/group.js"></script>
</body>

</html>