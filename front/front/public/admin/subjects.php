<!DOCTYPE html>
<html lang="ua">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/static/css/base.css">
    <link rel="stylesheet" href="/static/css/admin/base.css">
    <link rel="stylesheet" href="/static/css/header.css">
    <title>Наявні предмети</title>
</head>

<body>
    <?php
    $current = 'subjects';
    require $_SERVER['DOCUMENT_ROOT'] . '/../includes/admin/header.php';
    require $_SERVER['DOCUMENT_ROOT'] . '/../includes/preloader.php';
    ?>

    <div id="content">
        <div class="title_block">
            <div class="title">Наявні предмети</div>
            <a href="new_subject.php">
                <div class="blue_button">
                    <div class="button_icon add_icon"></div>
                    <div>Додати предмет</div>
                </div>
            </a>
            <div class="appear_on_change appear_transition title_block">
                <div class="blue_button" onclick="saveGroupChanges(this)">
                    <div class="button_icon save_icon"></div>
                    <div>Зберегти зміни</div>
                </div>
                <div class="blue_button" onclick="changesSet.discardChanges()">
                    <div class="button_icon back_icon"></div>
                    <div>Прибрати зміни</div>
                </div>
        </div>
        </div>
        <table class="default_table appear_transition" id="subjects_table">
            <thead>
                <tr>
                    <th>№</th>
                    <th>Назва</th>
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
    <script src="https://cdn.jsdelivr.net/gh/nextapps-de/flexsearch@master/dist/flexsearch.light.js"></script>
    <script type="text/javascript" src="/static/js/hidable_children_element.js"></script>
    <script type="text/javascript" src="/static/js/admin/subjects.js"></script>

</body>

</html>