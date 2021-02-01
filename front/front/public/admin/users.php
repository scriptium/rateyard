<!DOCTYPE html>
<html lang="en">

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
    $current = 'users';
    require $_SERVER['DOCUMENT_ROOT'] . '/../includes/header.php';
    ?>
    <div id="content">
        <div class="title">Наявні учні</div>
        <table>
            <tr>
                <th>№</th>
                <th>ПІБ</th>
                <th>Клас</th>
                <th>Логін</th>
                <th>Адреса електронної пошти</th>
            </tr>
        </table>
    </div>
</body>

</html>