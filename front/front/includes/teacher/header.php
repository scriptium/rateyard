<div id="teacher_header">
    <div>
        <div id="burger_wrapper" onclick="document.getElementById('side_bar').classList.toggle('opened')">
            <?php
            echo file_get_contents($_SERVER['DOCUMENT_ROOT'] . '/static/images/burger.svg');
            ?>
        </div>
        <div class="logo_main">Rateyard</div>
        <div class="logo_caption">Teacher</div>
    </div>
    <div>
        <div id="teacher_user">
            <a id="header_teacher_full_name" href="nahui">Hello</a>
            <div class="user_icon header_icon"></div>
        </div>
        <div id="exit_button" onclick="logoutButton(this)">
            <div class="blue_exit_icon"></div>
            <div>Вихід</div>
        </div>
    </div>
</div>
<div id="side_bar" onclick="document.getElementById('side_bar').classList.toggle('opened')">
</div>