<!DOCTYPE html>
<html lang="ua">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/static/css/base.css">
    <link rel="stylesheet" href="/static/css/login.css">
    <link rel="stylesheet" href="/static/css/restore_password.css">
    <title>Відновлення паролю</title>
</head>

<body>
    <div id="login_block">
        <div>
            <div class="logo_caption">Відновлення паролю</div>
            <div class="message">
                На вашу пошту pedik****@gmail.com відправлено код відновлення.
            </div>
        </div>
        <input class="default_input_text" placeholder="Введіть ваш логін" autocomplete="off" id="username_input" type="text">
        <input id="restore_person" type="hidden" value="student">
        <div class="blue_button">Відправити пароль</div>
    </div>
    
    <script type="text/javascript" src="/static/js/base.js"></script>
    <script type="text/javascript" src="/static/js/rateyard_api_client.js"></script>
    <script type="text/javascript" src="/static/js/student/api.js"></script>
    <script type="text/javascript" src="/static/js/student/base.js"></script>
    <script type="text/javascript" src="/static/js/restore_password.js"></script>
</body>

</html>