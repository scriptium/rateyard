<div id="teacher_header">
    <div>
        <div id="burger_wrapper" onclick="document.getElementById('sidebar').classList.toggle('opened')">
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
<div id="sidebar">
    <div>
        <div class="sidebar_text">Ваші групи: </div>
        <div id="sidebar_close_wrapper" onclick="document.getElementById('sidebar').classList.toggle('opened')">
            <?php
            echo file_get_contents($_SERVER['DOCUMENT_ROOT'] . '/static/images/delete.svg');
            ?>
        </div>
    </div>
    <template id="group_box_template">
        <div class="group_box">
            <div>
                <span class="class_name">fsdfsdf</span>
                <span class="group_name">fsdfsdf</span>
            </div>
            <span>dsdasdsa</span>
        </div>
    </template>
</div>