const loginButton = document.getElementById('login_button');
const usernameInput = document.getElementById('username_input');
const passwordInput = document.getElementById('password_input');

class LoginPageAdapter {
    constructor(accessTokenKey, refreshTokenKey, checkTokenPath, loginPath, mainPagePath) {
        this.accessTokenKey = accessTokenKey;
        this.refreshTokenKey = refreshTokenKey;
        this.checkTokenPath = checkTokenPath;
        this.loginPath = loginPath;
        this.apiClient = new RateyardApiClient(
            localStorage.getItem(accessTokenKey),
            localStorage.getItem(refreshTokenKey),
            ''
        );
        this.mainPagePath = mainPagePath;
        loginButton.onclick = () => {
            this.login();
        }
        document.addEventListener(
            'keypress',
            (event) => {
                if (event.key == 'Enter' && !loginButton.classList.contains('disabled')) {
                    this.login();
                }
            }
        );
    }
    async tryLoginByToken() {
        try {
            let xhr = await this.apiClient.sendRequest(this.checkTokenPath, 'GET', {}, undefined, true);
            if (xhr.status === 200) {
                document.location.replace(this.mainPagePath);
            }
        } catch (e) {
            hidePreloader();
        }
    }
    async login() {
        loginButton.classList.add('disabled');
        this.apiClient.sendRequest(
            this.loginPath, 'POST', {'Content-Type': 'application/json'}, JSON.stringify({
                username: usernameInput.value,
                password: passwordInput.value
            })
        ).then((xhr) => {
            if (xhr.status == 403) {
                loginButton.classList.remove('disabled');
                usernameInput.classList.add('wrong');
                passwordInput.classList.add('wrong');
                usernameInput.oninput = passwordInput.oninput = () => {
                    usernameInput.classList.remove('wrong');
                    passwordInput.classList.remove('wrong');
                }
            }
            else {
                localStorage.setItem(this.accessTokenKey, xhr.getResponseHeader('Access-Token'));
                localStorage.setItem(this.refreshTokenKey, xhr.getResponseHeader('Refresh-Token'));
                document.location.replace(this.mainPagePath);
            }
        });
    }
}