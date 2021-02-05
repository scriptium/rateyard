<!DOCTYPE html>
<html lang="ua">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/static/css/base.css">
    <link rel="stylesheet" href="/static/css/admin/login.css">
    <title>Вхід</title>
</head>

<body>
    <div id="login_block">
            <div>
                <div class="logo_main">Rateyard</div>
                <div class="logo_caption">Admin</div>
            </div>
            <input class="default_input_text" placeholder="Логін" autocomplete="off" id="username_input" type="text">
            <input class="default_input_text" placeholder="Пароль" autocomplete="off" id="password_input" type="password">
        <div class="blue_button" onclick="loginButton(this)">Увійти</div>
    </div>
    <script type="text/javascript" src="/static/js/admin/api.js"></script>
    <script type="text/javascript" src="/static/js/admin/base.js"></script>
    <script type="text/javascript" src="/static/js/admin/login.js"></script>
</body>

</html>