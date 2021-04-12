<!DOCTYPE html>
<html lang="ua">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/static/css/base.css">
    <link rel="stylesheet" href="/static/css/login.css">
    <title>Вхід</title>
    <?php require $_SERVER['DOCUMENT_ROOT'] . '/../includes/icons.php'; ?>
</head>

<body>
    <?php require $_SERVER['DOCUMENT_ROOT'] . '/../includes/preloader.php'; ?>
    <div id="login_block">
        <div>
            <div class="logo_main">Rateyard</div>
            <div class="logo_caption">Teacher</div>
        </div>
        <input class="default_input_text" placeholder="Логін" autocomplete="off" id="username_input" type="text">
        <input class="default_input_text" placeholder="Пароль" autocomplete="off" id="password_input" type="password">
        <div id="account">
            <a class="a text forget_password" href="restore_password.php">Забули пароль?</a>
            <div class="blue_button" onclick="loginButton(this)">Увійти</div>
        </div>
    </div>
    <script type="text/javascript" src="/static/js/base.js"></script>
    <script type="text/javascript" src="/static/js/rateyard_api_client.js"></script>
    <script type="text/javascript" src="/static/js/teacher/login.js"></script>
</body>

</html>