<!DOCTYPE html>
<html lang="ua">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/static/css/base.css">
    <link rel="stylesheet" href="/static/css/login.css">
    <link rel="stylesheet" href="/static/css/restore_password.css">
    <title>Зміна паролю</title>
    <?php require $_SERVER['DOCUMENT_ROOT'] . '/../includes/icons.php'; ?>
</head>

<body>
    <?php
        require $_SERVER['DOCUMENT_ROOT'] . '/../includes/preloader.php';
    ?>
    <div id="login_block">
        <div>
            <div class="logo_caption">Зміна паролю</div>
            <div class="message">
                На вашу пошту --- відправлено код відновлення.
            </div>
        </div>
        <input class="default_input_text" placeholder="Введіть ваш пароль" autocomplete="off" id="username_input" type="password">
        <div class="blue_button">Підтвердити</div>
    </div>
    
    <script type="text/javascript" src="/static/js/base.js"></script>
    <script type="text/javascript" src="/static/js/rateyard_api_client.js"></script>
    <?php
        $user_type = 'student';
        require $_SERVER['DOCUMENT_ROOT'] . '/../includes/include_api.php';
    ?>
    <script type="text/javascript" src="/static/js/change_password.js"></script>
</body>

</html>