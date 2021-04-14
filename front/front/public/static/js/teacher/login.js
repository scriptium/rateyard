let adapter = new LoginPageAdapter(
    'teacher_access_token',
    'teacher_refresh_token',
    '/teacher/check_token',
    '/auth/login_teacher',
    'index.php'
)
adapter.tryLoginByToken();