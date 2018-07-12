import css from './AccountSettings.css';
import React from 'react';
import { system } from './index.jsx';

export class AccountSettings extends React.Component {

    constructor() {
        super();
    }

    changeEmail() {
        system.callServerMethod("changeEmail", document.getElementById("newEmail").value, function(success) {
            console.log(success);
        })
    }

    changePassword() {

        var model = {
            OldPassword: document.getElementById("oldPassword").value,
            Password: document.getElementById("newPassword").value,
            PasswordConfirm: document.getElementById("confirmNewPassword").value
        }

        if (model.Password != model.PasswordConfirm) return;

        system.callServerMethod("changePassword", model, (success) => {
            console.log(success);
        })
    }

    render() {
        console.log("rendering");

        return (
            <div className="accountSettingsWrap">
                <input type="text" id="newEmail" placeholder="Change your email"/>
                <button onClick={this.changeEmail}>Change email</button>
                <input type="password" id="oldPassword" placeholder="Your current password"/>
                <input type="password" id="newPassword" placeholder="New password"/>
                <input type="password" id="confirmNewPassword" placeholder="Confirm new password"/>
                <button onClick={() => {this.changePassword()}}>Change password</button>
            </div>
        );
    }
}