<!DOCTYPE html>
<html lang="ua">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/static/css/base.css">
    <link rel="stylesheet" href="/static/css/login.css">
    <link rel="stylesheet" href="/static/css/reset_password.css">
    <title>Відновлення паролю</title>
    <?php require $_SERVER['DOCUMENT_ROOT'] . '/../includes/icons.php'; ?>
</head>

<body>
    <?php
        require $_SERVER['DOCUMENT_ROOT'] . '/../includes/hidden_preloader.php';
    ?>
    <div id="login_block">
        <div>
            <div class="logo_caption">Відновлення паролю</div>
            <div class="message hidden">
                На вашу електронну пошту відправлено код підтвердження. 
            </div>
        </div>
        <input class="default_input_text" placeholder="Адреса електронної пошти" autocomplete="off" id="input" type="text" oninput="updateButton(event)">
        <div class="blue_button disabled">Далі</div>
    </div>
    
    <script type="text/javascript" src="/static/js/base.js"></script>
    <script type="text/javascript" src="/static/js/rateyard_api_client.js"></script>
    <script type="text/javascript" src="/static/js/reset_password.js"></script>
</body>

</html>