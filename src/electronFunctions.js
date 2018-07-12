import { remote } from "electron";
const { session } = remote;
import { url } from './index.jsx';
import axios from 'axios';
import qs from 'qs';
import { parse } from 'url';

export function saveCookie(name, value) {
    const cookie = { url: url, name: name, value: value, expirationDate: Math.floor(new Date().getTime()/1000)+1209600};

    removeCookie(name);

    session.defaultSession.cookies.set(cookie, (error) => {
        if (error == undefined || error == null) {
            console.log("Saved cookie...");
            return;
        }
        console.log(error.message);
    });
}

export function getCookie(name, asyncCallback) {

    session.defaultSession.cookies.get({name: name}, (error, cookies) => {
        if (cookies.length == 0) {
            asyncCallback();
        }
        else {
            asyncCallback(cookies[0].value);
        }
    });

}

export function removeCookie(name) {
    session.defaultSession.cookies.remove(url, name, function() {
        //well..
    });
}

const FACEBOOK_AUTHORIZATION_URL = "https://www.facebook.com/v3.0/dialog/oauth";

export async function facebookSignIn(callback) {

    const accessCode = await signInWithFacebookPopup(false);

    const signModel = {
        ExternalIdToken: accessCode,
        PersistLogin: true,
        UserRole: 0
    }

    function serverCallback(user) {
        console.log(user);
        if (user == null || user.AccessToken == null || user.AccessToken == undefined) {
            console.log("Login failed..");
            return;
        }
        saveCookie("CelestisAccessToken", user);
        callback(user);
    }

    system.callServerMethod("facebookAccessLogin", signModel, serverCallback);

}

export async function facebookSignInRerequest(callback) {

    const accessCode = await signInWithFacebookPopup(true);

    const signModel = {
        ExternalIdToken: accessCode,
        UserRole: 0,
        PersistLogin: true
    }

    function serverCallback(user) {
        console.log(user);
        if (user == null || user.AccessToken == null || user.AccessToken == undefined) {
            console.log("Login failed..");
            return;
        }
        saveCookie("CelestisAccessToken", user);
        callback(user);
    }

    system.callServerMethod("facebookAccessLogin", signModel, serverCallback);

}

async function signInWithFacebookPopup(rerequest) {
    return new Promise((resolve, reject) => {
        const authWindow = new remote.BrowserWindow({
          width: 1200,
          height: 800,
          show: true,
          webPreferences: { nodeIntegration:false}
        })

        const urlParams = {
            client_id: '217982295477581',
            redirect_uri: "http://localhost:19712/",
            state: "<|-_-|>",
            scope: "public_profile, email"
        }

        if (rerequest) {
            urlParams.auth_type = "rerequest";
        }

        const authUrl = `${FACEBOOK_AUTHORIZATION_URL}?${qs.stringify(urlParams)}`;

        console.log(authUrl);
    
        function handleNavigation (url) {
            console.log(url);
            const query = parse(url, true).query
            if (query) {
                if (query.error) {
                    reject(new Error(`There was an error: ${query.error}`))
                } else if (query.code) {
                    // Login is complete
                    authWindow.removeAllListeners('closed')
                    setImmediate(() => authWindow.close())
        
                    // This is the authorization code we need to request tokens
                    resolve(query.code)
                }
            }
        }
    
        authWindow.on('closed', () => {
          // TODO: Handle this smoothly
          throw new Error('Auth window was closed by user')
        })
    
        authWindow.webContents.on('will-navigate', (event, url) => {
            handleNavigation(url)
        })
    
        authWindow.webContents.on('did-get-redirect-request', (event, oldUrl, newUrl) => {
            handleNavigation(newUrl)
        })
    
        authWindow.loadURL(authUrl)
      })
}


const GOOGLE_AUTHORIZATION_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://www.googleapis.com/oauth2/v4/token';
const GOOGLE_PROFILE_URL = 'https://www.googleapis.com/userinfo/v2/me';

export async function googleSignIn(callback) {
    const code = await signInWithGooglePopup();

    const signModel = {
        ExternalIdToken: code,
        UserRole: 0
    }

    function serverCallback(user) {
        console.log(user);
        if (user == null || user.AccessToken == null || user.AccessToken == undefined) {
            console.log("Login failed..");
            return;
        }
        saveCookie("CelestisAccessToken", user);
        callback(user);
    }

    system.callServerMethod("googleTokenLogin", signModel, setToken);
}

async function fetchAccessTokens(code) {
    const response = await axios.post(GOOGLE_TOKEN_URL, qs.stringify({
      code: code,
      client_id: "883435917295-qoimu0s0to680pbbgj3r24roudmefjdd.apps.googleusercontent.com",
      client_secret: "Vq1AqWna2WoYmoPJP4kmFfsw",
      redirect_uri: "http://localhost:19712",
      grant_type: 'authorization_code',
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    return response.data
}

export async function fetchGoogleProfile (accessToken) {
    const response = await axios.get(GOOGLE_PROFILE_URL, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
    })
    return response.data
}

function signInWithGooglePopup() {
    return new Promise((resolve, reject) => {
      const authWindow = new remote.BrowserWindow({
        width: 500,
        height: 800,
        show: true,
      })
  
      // TODO: Generate and validate PKCE code_challenge value
      const urlParams = {
        response_type: 'code',
        redirect_uri: "http://localhost:19712",
        client_id: "883435917295-qoimu0s0to680pbbgj3r24roudmefjdd.apps.googleusercontent.com",
        scope: 'profile email',
      }
      const authUrl = `${GOOGLE_AUTHORIZATION_URL}?${qs.stringify(urlParams)}`
  
      function handleNavigation (url) {
        const query = parse(url, true).query
        if (query) {
            if (query.error) {
            reject(new Error(`There was an error: ${query.error}`))
            } else if (query.code) {
            // Login is complete
            authWindow.removeAllListeners('closed')
            setImmediate(() => authWindow.close())

            // This is the authorization code we need to request tokens
            resolve(query.code)
            }
        }
      }
  
      authWindow.on('closed', () => {
        // TODO: Handle this smoothly
        throw new Error('Auth window was closed by user')
      })
  
      authWindow.webContents.on('will-navigate', (event, url) => {
        handleNavigation(url)
      })
  
      authWindow.webContents.on('did-get-redirect-request', (event, oldUrl, newUrl) => {
        handleNavigation(newUrl)
      })
  
      authWindow.loadURL(authUrl)
    })
  }