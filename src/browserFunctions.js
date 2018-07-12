export function saveCookie(name, value) {
    document.cookie = name + "=" + value;
}

export function getCookie(name, callback) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) {
        callback(parts.pop().split(";").shift());   
    }
    else {
        callback();
    }
}

export function removeCookie(name) {
    document.cookie = name+'=; Max-Age=-99999999;';
}

export async function googleSignIn(callback) {

    return import (/* webpackChunkName: "gapi" */ './gapi.js').then(gapi => {

        var gapi = gapi.default;

        gapi.load('auth2', async function() {
            gapi.auth2.init({client_id: "883435917295-qoimu0s0to680pbbgj3r24roudmefjdd.apps.googleusercontent.com"});
    
            setTimeout(async function() {
                var authInstance = gapi.auth2.getAuthInstance();
    
                var googleUser = await authInstance.signIn({
                    scope: 'profile email'
                });
                const profile = googleUser.getBasicProfile();
        
                console.log(profile);
                const user = {
                    uid: profile.getId(),
                    email: profile.getEmail(),
                    displayName: profile.getName(),
                    firstName: profile.getGivenName(),
                    lastName: profile.getFamilyName(),
                    idToken: googleUser.getAuthResponse().id_token
                }
                console.log(user);
                const signModel = {
                    Email: user.email,
                    ExternalIdToken: user.idToken,
                    PersistLogin: true,
                    FirstName: user.firstName,
                    LastName: user.lastName
                }
        
                function setToken(user) {
                    console.log(user);
                    if (user == null || user.AccessToken == null || user.AccessToken == undefined) {
                        console.log("Login failed..");
                        return;
                    }
                    saveCookie("CelestisAccessToken", user.AccessToken);
                    callback(user);
                }
        
                system.callServerMethod("googleLogin", signModel, setToken);
            }, 200);
        });
    });
}

export async function facebookSignIn(callback) {

    var js = document.getElementsByTagName("script")[0];

    (function(d, s, id){
        var fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {
            FB.login(function(response) {
                console.log(response.authResponse.accessToken);
        
                const signModel = {
                    ExternalIdToken: response.authResponse.accessToken,
                    UserRole: 0
                }
        
                function serverCallback(user) {
                    console.log(user);
                    if (user == null || user.AccessToken == null || user.AccessToken == undefined) {
                        console.log("Login failed..");
                        return;
                    }
                    saveCookie("CelestisAccessToken", user.AccessToken);
                    callback(user);
                }
        
                system.callServerMethod("facebookTokenLogin", signModel, serverCallback);
            }, {scope: 'public_profile,email'});
            return;
        }
        js = d.createElement(s); js.id = id;
        js.src = "https://connect.facebook.net/en_US/all.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    js.onload = function() {
        FB.init({
            appId: '217982295477581',
            cookie: true,
            xfbml: true, 
            version: 'v3.0'
        });

        FB.login(function(response) {
            console.log(response.authResponse.accessToken);
    
            const signModel = {
                ExternalIdToken: response.authResponse.accessToken,
                UserRole: 0,
                PersistLogin: true
            }
    
            function serverCallback(token) {
                console.log(token);
                if (token == null || token == undefined) {
                    console.log("Login failed..");
                    return;
                }
                saveCookie("CelestisAccessToken", token);
                callback();
            }
    
            system.callServerMethod("facebookTokenLogin", signModel, serverCallback);
        }, {scope: 'public_profile,email'});
    }

}

export async function facebookSignInRerequest(callback) {

    var js = document.getElementsByTagName("script")[0];

    (function(d, s, id){
        var fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {
            FB.login(function(response) {
                console.log(response.authResponse.accessToken);
        
                const signModel = {
                    ExternalIdToken: response.authResponse.accessToken,
                    UserRole: 0
                }
        
                function serverCallback(token) {
                    console.log(token);
                    if (token == null || token == undefined) {
                        console.log("Login failed..");
                        return;
                    }
                    saveCookie("CelestisAccessToken", token);
                    callback();
                }
        
                system.callServerMethod("facebookTokenLogin", signModel, serverCallback);
            }, {scope: 'public_profile,email', auth_type: "rerequest"});
            return;
        }
        js = d.createElement(s); js.id = id;
        js.src = "https://connect.facebook.net/en_US/all.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    js.onload = function() {
        FB.init({
            appId: '217982295477581',
            cookie: true,
            xfbml: true, 
            version: 'v3.0'
        });

        FB.login(function(response) {
            console.log(response.authResponse.accessToken);
    
            const signModel = {
                ExternalIdToken: response.authResponse.accessToken,
                UserRole: 0
            }
    
            function serverCallback(token) {
                console.log(token);
                callback();
            }
    
            system.callServerMethod("facebookTokenLogin", signModel, serverCallback);
        }, {scope: 'public_profile,email', auth_type: "rerequest"});
    }

}