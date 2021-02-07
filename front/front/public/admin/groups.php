<!DOCTYPE html>
<html lang="ua">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/static/css/base.css">
    <link rel="stylesheet" href="/static/css/admin/base.css">
    <link rel="stylesheet" href="/static/css/admin/header.css">
    <title>Наявні групи</title>
</head>

<body>
<?php 
    $current = 'groups';
    require $_SERVER['DOCUMENT_ROOT'] . '/../includes/admin/header.php';
    ?>
    <div id="content">
        <div id="title_block">
            <div class="title">Наявні групи</div>
            <div class="blue_button">
                <div class="button_icon add_icon"></div>
                <div>Додати групу</div>
            </div>
        </div>
        <input type="text" class="default_input_text" placeholder="Пошук груп">
        <table class="default_table appear_transition" id="groups_table">
            <tbody>
                <tr>
                    <th>№</th>
                    <th>Назва</th>
                    <th>Клас</th>
                </tr>
            </tbody>
            <tbody>
            </tbody>

        </table>
    </div>
    <script type="text/javascript" src="/static/js/base.js"></script>
    <script type="text/javascript" src="/static/js/admin/base.js"></script>
    <script type="text/javascript" src="/static/js/admin/api.js"></script>
    <script type="text/javascript" src="/static/js/admin/groups.js"></script>
</body>

</html>