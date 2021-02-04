<div id="header">
    <div>
        <div class="logo_main">Rateyard</div>
        <div class="logo_caption">Admin</div>
    </div>
    <div>
        <a <?php 
        if($current == 'students'){echo 'id="current"';}
        ?> href="students.php">
            <div>Учні</div>
        </a>
        <a <?php 
        if($current == 'groups'){echo 'id="current"';}
        ?> href="groups.php">
            <div>Групи</div>
        </a>
        <a <?php 
        if($current == 'teachers'){echo 'id="current"';}
        ?> href="teachers.php">
            <div>Вчителі</div>
        </a>
        <a <?php 
        if($current == 'classes'){echo 'id="current"';}
        ?> href="classes.php">
            <div>Класи</div>
        </a>
        <a <?php 
        if($current == 'subjects'){echo 'id="current"';}
        ?> href="subjects.php">
            <div>Предмети</div>
        </a>
        <div id="exit_button">
            <div class="exit_icon"></div>
            <div>Вихід</div>
        </div>
    </div>
</div>