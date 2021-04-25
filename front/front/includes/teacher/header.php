<div id="teacher_header">
    <div>
        <div id="burger_wrapper" onclick="openSidebar()">
            <?php
            echo file_get_contents($_SERVER['DOCUMENT_ROOT'] . '/static/images/burger.svg');
            ?>
        </div>
        <div class="logo_main">Rateyard</div>
        <div class="logo_caption">Teacher</div>
    </div>
    <div>
        <a id="teacher_user" href="account.php">
            <div id="header_teacher_full_name"></div>
            <?php
            echo file_get_contents($_SERVER['DOCUMENT_ROOT'] . '/static/images/user.svg');
            ?>
        </a>
        <div id="exit_button" onclick="logoutButton(this)">
            <div class="blue_exit_icon"></div>
            <div>Вихід</div>
        </div>
    </div>
</div>
<div id="sidebar">
    <a href="index.php" class="group_box
    <?php
    if ($current == 'index') {
        echo 'current';
    }
    ?>">
        <span class="group_name">Головна</span>
    </a>
    <div class="sidebar_text">Ваші групи: </div>
    <template id="group_box_template">
        <a href="#" class="group_box">
            <div>
                <span class="class_name"></span>
                <span class="group_name"></span>
            </div>
            <span></span>
        </a>
    </template>
</div>
<div id="sidebar_close_area" onclick="closeSidebar()">
</div>
<div id="locker" class="hidden">
    <div id="unlock_login_block">
        <div id="locker_title">
            <?php
            echo file_get_contents($_SERVER['DOCUMENT_ROOT'] . '/static/images/user.svg');
            ?>
            <div id="locker_teacher_full_name"></div>
        </div>
        <input class="default_input_text" placeholder="Пароль" autocomplete="off" id="locker_password_input" type="password">
        <div class="blue_button" id="unlock_button">Розблокувати</div>
    </div>
</div>