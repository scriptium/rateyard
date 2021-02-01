<!DOCTYPE html>
<html lang="en">

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
    require $_SERVER['DOCUMENT_ROOT'] . '/../includes/header.php';
    ?>
    <div id="content">
        <div>
            <div class="title">Наявні групи</div>
            <div class="blue-button">Додати групу</div>
        </div>
        <div class="search-block">
            <input type="search" placeholder="Пошук груп">
        </div>
    </div>
</body>

</html>