let adapter = new LoginPageAdapter(
    'student_access_token',
    'student_refresh_token',
    '/student/check_token',
    '/auth/login_student',
    'index.php'
)
adapter.tryLoginByToken();