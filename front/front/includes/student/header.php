<div id="teacher_header">
    <div>
        <div id="burger_wrapper" onclick="openSidebar()">
            <?php
            echo file_get_contents($_SERVER['DOCUMENT_ROOT'] . '/static/images/burger.svg');
            ?>
        </div>
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
<div id="sidebar" class="stretchable">
    <div id="sidebar_close_wrapper" onclick="closeSidebar()">
        <?php
        echo file_get_contents($_SERVER['DOCUMENT_ROOT'] . '/static/images/delete.svg');
        ?>
    </div>
    <a href="index.php" class="subject_box
    <?php
    if ($current == 'index') {
        echo 'current';
    }
    ?>">
        <div>Головна сторінка</div>
    </a>
    <div class="sidebar_text">Список предметів: </div>
</div>
<div id="sidebar_close_area" onclick="closeSidebar()">
</div>
<template id="subject_box_template">
        <a class="subject_box">
            <div class='subject_name'></div>
            <div class="new-marks-wrapper">
                <div class="new-marks">
                    <div></div>
                </div>
            </div>
        </a>
</template>