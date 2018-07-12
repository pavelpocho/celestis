import css from './RegisterDialog.css';
import React from 'react';
import { saveCookie, googleSignIn, facebookSignIn, facebookSignInRerequest } from './index.jsx';
import { MainActivity } from './MainActivity.jsx';
import { Window } from 'universal-app-platform';

export class RegisterDialog extends React.Component {

    constructor() {
        super();
    }

    register() {
        console.log("Creating account...");

        var signObject = {
            Email: document.getElementById("userNameReg").value,
            UserName: document.getElementById("userNameReg").value,
            Password: document.getElementById("passwordReg").value,
            PasswordConfirm: document.getElementById("passwordConfirmReg").value,
            FirstName: document.getElementById("firstNameReg").value,
            LastName: document.getElementById("lastNameReg").value,
            UserRole: document.getElementById("accountTypeSelect").value
        }

        console.log(signObject);
        
        if (signObject.Password != signObject.PasswordConfirm) {
            console.log("FAIL! Passwords don't match");
            return;
        }

        function setToken(user) {
            if (user == null || user == undefined) {
                console.log("Login failed..");
                return;
            }
            saveCookie("CelestisAccessToken", user.AccessToken);
            system.startActivity(<MainActivity activityId="mainActivity" user={user}/>);
        }

        system.callServerMethod("register", signObject, setToken);
    }

    render() {
        return (
            <Window windowId={this.props.windowId} height={this.props.height} width={this.props.width} system={system}>
                <div id="registerDialog">
                    <h1>Sign up</h1>
                    <p>Username (email)</p>
                    <input type="text" id="userNameReg"/>
                    <p>First name</p>
                    <input type="text" id="firstNameReg"/>
                    <p>Last name</p>
                    <input type="text" id="lastNameReg"/>
                    <p>Password</p>
                    <input type="password" id="passwordReg"/>
                    <p>Repeat password</p>
                    <input type="password" id="passwordConfirmReg"/>
                    <select name="accountType" id="accountTypeSelect">
                        <option value="0">Student</option>
                        <option value="1">Teacher</option>
                    </select>
                    <button onClick={this.register}>Create account</button>
                </div>
            </Window>
        );
    }
}