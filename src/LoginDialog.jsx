import css from './LoginDialog.css';
import React from 'react';
import { saveCookie, googleSignIn, facebookSignIn, facebookSignInRerequest } from './index.jsx';
import { MainActivity } from './MainActivity.jsx';
import { Window } from 'universal-app-platform';
import googleIcon from '../assets/images/google.png';
import facebookIcon from '../assets/images/facebook.png';

/*
public class FrontendUserModel
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string AccessToken { get; set; }
}
*/

export class LoginDialog extends React.Component {

    constructor() {
        super();

        this.state = { 
            passResetFieldShown: false
         };
    }

    login() {
        console.log("Logging in...");

        var signObject = {
            UserName: document.getElementById("loginUsername").value,
            Password: document.getElementById("loginPassword").value,
            PersistLogin: document.getElementById("loginStaySigned").checked
        }

        console.log(signObject);

        function setToken(user) {
            if (user == null || user == undefined) {
                console.log("Login failed..");
                return;
            }
            saveCookie("CelestisAccessToken", user.AccessToken);
            system.startActivity(<MainActivity activityId="mainActivity" user={user} key="mainActivity"/>);
        }

        system.callServerMethod("login", signObject, setToken);
    }

    googleLogin() {

        function callback(user) {
            console.log("Callback WROKDS");
            system.startActivity(<MainActivity activityId="mainActivity" user={user} key="mainActivity"/>);
        }

        googleSignIn(callback);

    }

    facebookLogin() {

        function callback(user) {
            console.log("Worked");
            system.startActivity(<MainActivity activityId="mainActivity" user={user} key="mainActivity"/>);
        }
        
        facebookSignIn(callback);

    }

    facebookLoginRerequest() {

        function callback() {
            console.log("Worked");
            system.startActivity(<MainActivity activityId="mainActivity" user={user} key="mainActivity"/>);
        }
        
        facebookSignInRerequest(callback);

    }

    showResetField() {
        console.log("showing");
        this.setState({
            passResetFieldShown: true
        });
    }

    resetPassword() {
        system.callServerMethod("sendResetEmail", document.getElementById("passResetField").value, (success) => {
            console.log(success);
        })
    }

    render() {

        const passResetField = this.state.passResetFieldShown ? <input type="text" id="passResetField"/> : null;
        const passResetButton = this.state.passResetFieldShown ? <button onClick={this.resetPassword}>Reset password</button> : null;

        return (
            <Window windowId={this.props.windowId} width={this.props.width} height={this.props.height} system={system}>
                <div className="loginDialog">
                    <div className="externalLogin">
                        <p className="externalLoginTitle">Use External Account</p>
                        <button onClick={this.googleLogin} className="externalLoginButton">
                            <img src={googleIcon}/>
                            Log in with Google
                        </button>
                        <button onClick={this.facebookLoginRerequest} className="externalLoginButton">
                            <img src={facebookIcon}/>
                            Log in with Facebook
                        </button>
                    </div>
                    <div className="internalLogin">
                        <p className="internalLoginTitle">Use Celestis Account</p>
                        <div>
                            <p className="inputTitle">Email</p>
                            <input type="text" placeholder="email@example.com" id="loginUsername" />
                        </div>
                        <div>
                            <p className="inputTitle">Password</p>
                            <input type="password" id="loginPassword" placeholder="********"/>
                        </div>
                        <div className="stayLoggedWrap">
                            <p>Stay logged in</p>
                            <input type="checkbox" name="Stay logged in" id="loginStaySigned"/>
                        </div>
                        <button onClick={this.login}>
                            Log in
                            <i className="material-icons">arrow_forward</i>
                        </button>
                        <button onClick={() => {this.showResetField()}} className="forgotPassword">Forgot my password</button>
                        {passResetField}
                        {passResetButton}
                    </div>
                </div>
            </Window>
        );
    }
}