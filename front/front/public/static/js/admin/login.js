let adapter = new LoginPageAdapter(
    'admin_access_token',
    'admin_refresh_token',
    '/admin/check_token',
    '/auth/login_admin',
    'students.php'
)
adapter.tryLoginByToken();