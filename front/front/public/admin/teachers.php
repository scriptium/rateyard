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
        require $_SERVER['DOCUMENT_ROOT'] . '/../includes/header.php';
    ?>
    <div id="content">
    <div id="title_block">
        <div class="title">Наявні вчителі</div>
            <div class="blue_button">
                <div class="button_icon add_icon"></div>
                <div>Додати вчителя</div>
            </div>
        </div>
    </div>
</body>

</html>