import auth0 from 'auth0-js';

const webAuth = new auth0.WebAuth({
    domain: 'dev-84pqkjz5.us.auth0.com',
    clientID: '8GJjaeHcFQOb86aV8vMWJRXYKXl9BM1V',
    redirectUri: '',
    responseType: 'token id_token',
    scope: 'openid profile'
})
let token = {}
const handleAuth = cb => {
    webAuth.parseHush((error, authResult) => {
        if (authResult && authResult.accessToken && authResult.idToken) {
            token.accessToken = authResult.accessToken;
            token.idToken = authResult.idToken;
            cb();
        } else {
            console.log('error auth service');
        }
    })
}

function login() {
    webAuth.authorize();
}
export { login };