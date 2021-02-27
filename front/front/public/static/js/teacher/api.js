let adminRateyardApiClient = new RateyardApiClient(
    localStorage.getItem('teacher_access_token'),
    localStorage.getItem('teacher_refresh_token'),
    '/teacher/',
    (accessToken, refreshToken) => {
        localStorage.setItem('teacher_access_token', accessToken),
            localStorage.setItem('teacher_refresh_token', refreshToken)
    },
    () => {
        console.log('Wrong token')
        document.location.replace('/teacher/login.php');
    }
)
