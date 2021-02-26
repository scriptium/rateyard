let adminRateyardApiClient = new RateyardApiClient(
    localStorage.getItem('student_access_token'),
    localStorage.getItem('student_refresh_token'),
    '/student/',
    (accessToken, refreshToken) => {
        localStorage.setItem('student_access_token', accessToken),
            localStorage.setItem('student_refresh_token', refreshToken)
    },
    () => {
        console.log('Wrong token')
        document.location.replace('/student/login.php');
    }
)

















