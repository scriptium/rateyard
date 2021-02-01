<div id="header">
    <div>
        <div>Rateyard</div>
        <div>Admin</div>
    </div>
    <div>
        <a <?php 
        if($current == 'users'){echo 'id="current"';}
        ?> href="users.php"><div>УЧНІ</div></a>
        <a <?php 
        if($current == 'groups'){echo 'id="current"';}
        ?> href="groups.php"><div>ГРУПИ</div></a>
        <a <?php 
        if($current == 'teachers'){echo 'id="current"';}
        ?> href="teachers.php"><div>ВЧИТЕЛІ</div></a>
        <a <?php 
        if($current == 'classes'){echo 'id="current"';}
        ?> href="classes.php"><div>КЛАСИ</div></a>
        <a <?php 
        if($current == 'subjects'){echo 'id="current"';}
        ?> href="subjects.php"><div>ПРЕДМЕТИ</div></a>
    </div>
</div>