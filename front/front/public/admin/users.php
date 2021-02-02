<!DOCTYPE html>
<html lang="ua">

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
        <div id="title_block">
            <div class="title">Наявні учні</div>
            <div class="blue_button">
                <div class="button_icon add_icon"></div>
                <div>Додати учня</div>
            </div>
            <div class="excel_button">
                <div class="button_icon excel_icon"></div>
                <div>Імпорт з файлу Microsoft Excel</div>
            </div>
        </div>
        <table class="default_table">
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
                <tr>
                    <td>101</td>
                    <td><a href="#">Sosdsdasdsadsi</a></td>
                    <td>Sosdsdasdsadsi</td>
                    <td>Sosdsdasdsadsi</td>
                    <td>Sosdsdasdsadsi</td>
                </tr>
                <tr>
                    <td>101</td>
                    <td><a href="#">Sosdsdasdsadsi</a></td>
                    <td>Sosdsdasdsadsi</td>
                    <td>Sosdsdasdsadsi</td>
                    <td>Sosdsdasdsadsi</td>
                </tr>
                <tr>
                    <td>101</td>
                    <td><a href="#">Sosdsdasdsadsi</a></td>
                    <td>Sosdsdasdsadsi</td>
                    <td>Sosdsdasdsadsi</td>
                    <td>Sosdsdasdsadsi</td>
                </tr>
                <tr>
                    <td>101</td>
                    <td><a href="#">Sosdsdasdsadsi</a></td>
                    <td>Sosdsdasdsadsi</td>
                    <td>Sosdsdasdsadsi</td>
                    <td>Sosdsdasdsadsi</td>
                </tr>
                <tr>
                    <td>101</td>
                    <td><a href="#">Sosdsdasdsadsi</a></td>
                    <td>Sosdsdasdsadsi</td>
                    <td>Sosdsdasdsadsi</td>
                    <td>Sosdsdasdsadsi</td>
                </tr>

            </tbody>

        </table>
    </div>
</body>

</html>