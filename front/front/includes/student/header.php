<div id="teacher_header">
    <div>
        <div class="logo_main">Rateyard</div>
        <div class="logo_caption">Student</div>
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
