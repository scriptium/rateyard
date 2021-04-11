<!DOCTYPE html>
<html lang="ua">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/static/css/base.css">
    <link rel="stylesheet" href="/static/css/admin/base.css">
    <link rel="stylesheet" href="/static/css/header.css">
    <title>Наявні групи</title>
    <?php require $_SERVER['DOCUMENT_ROOT'] . '/../includes/icons.php'; ?>
</head>

<body>
<?php 
    $current = 'groups';
    require $_SERVER['DOCUMENT_ROOT'] . '/../includes/admin/header.php';
    require $_SERVER['DOCUMENT_ROOT'] . '/../includes/preloader.php';
    ?>
    <div id="content">
        <div class="title_block">
            <div class="title">Наявні групи</div>
            <a href="new_group.php">
                <div class="blue_button">
                    <div class="button_icon add_icon"></div>
                    <div>Додати групу</div>
                </div>
            </a>
        </div>
        <input type="text" class="default_input_text" placeholder="Пошук груп" oninput="searchGroups(this.value)">
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

    <script src="https://cdn.jsdelivr.net/gh/nextapps-de/flexsearch@master/dist/flexsearch.light.js"></script>
    <script type="text/javascript" src="/static/js/hidable_children_element.js"></script>
    <script type="text/javascript" src="/static/js/base.js"></script>
    <script type="text/javascript" src="/static/js/admin/base.js"></script>
    <script type="text/javascript" src="/static/js/rateyard_api_client.js"></script>
    <script type="text/javascript" src="/static/js/admin/api.js"></script>
    <script type="text/javascript" src="/static/js/admin/groups.js"></script>
</body>

</html>