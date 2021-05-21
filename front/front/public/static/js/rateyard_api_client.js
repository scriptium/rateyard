class RateyardApiClient {
    constructor(accessToken='', refreshToken='', pathPrefix='', onTokensUpdate, onTokensAreWrong) {
        this.baseApiUrl = `http://${window.location.hostname}/api`;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.pathPrefix = pathPrefix;
        this.onTokensUpdate = onTokensUpdate;
        this.onTokensAreWrong = onTokensAreWrong;
    }
    async refreshTokens() {
        return await new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open('GET', this.baseApiUrl + '/auth/refresh');
            xhr.setRequestHeader('Authorization', `Bearer ${this.refreshToken}`);
            xhr.onreadystatechange = () => {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status == 200) {
                        this.accessToken = xhr.getResponseHeader('Access-Token');
                        this.refreshToken = xhr.getResponseHeader('Refresh-Token');
                        if (typeof this.onTokensUpdate !== 'undefined')
                            new Promise(() => {
                                this.onTokensUpdate(
                                    this.accessToken,
                                    this.refreshToken
                                )
                            })
                        console.log('Tokens have refreshed.');
                        console.log(this.accessToken);
                        resolve({
                            accesToken: this.accessToken,
                            refreshToken: this.refreshToken,
                        });
                    }
                    else reject();
                }
            }
            xhr.send();
        });
    }
    async sendRequest(path='', method='GET', headers={}, body=null, needAccessToken=false) {
        return await new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = () => {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status == 401) {
                        this.refreshTokens().then(
                            openAndSend,
                            () => {
                                if (typeof this.onTokensAreWrong !== 'undefined')
                                    new Promise(() => { this.onTokensAreWrong(); })
                                reject(xhr);
                            }
                        );
                    }
                    else if (xhr.status == 422) {
                        if (typeof this.onTokensAreWrong !== 'undefined')
                            new Promise(() => { this.onTokensAreWrong(); })
                        reject(xhr);
                    }
                    else resolve(xhr);
                }
            }
            let openAndSend = () => {
                xhr.open(method, this.baseApiUrl + this.pathPrefix + path);
                if (headers!=undefined) {
                    for (const [name, value] of Object.entries(headers)) {
                        xhr.setRequestHeader(name, value);
                    }
                }
                if (needAccessToken) xhr.setRequestHeader('Authorization', `Bearer ${this.accessToken}`);
                xhr.send(body);
            }
            openAndSend();
        });
    }
}