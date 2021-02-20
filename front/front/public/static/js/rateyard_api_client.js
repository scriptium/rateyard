class RateyardApiClient {
    constructor (accesToken, refreshToken, pathPrefix, onTokensUpdate) {
        this.baseApiUrl = `http://${window.location.hostname}:8000`;
        this.accesToken = accesToken;
        this.refreshToken = refreshToken;
        this.pathPrefix = pathPrefix;
        this.onTokensUpdate = onTokensUpdate;
    }
    async sendRequestToApi(path, headers, requestBody){
        let xhr = new XMLHttpRequest;
        for (const [name, value] of Object.entries(headers)) {
            xhr.setRequestHeader(name, value);    
        }
    }
}