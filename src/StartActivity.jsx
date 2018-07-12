import css from './StartActivity.css';
import React from 'react';
import { Activity } from 'universal-app-platform';
import { url } from './index.jsx';
import { saveCookie, getCookie, removeCookie, googleSignIn, facebookSignIn, facebookSignInRerequest } from "./index.jsx";
import { LoginDialog } from './LoginDialog.jsx';
import { RegisterDialog } from './RegisterDialog.jsx';

console.log("Cookies" + document.cookie);

export class StartActivity extends React.Component{

    componentDidMount() {
        setTimeout(() => {
            system.clearActivityStack();
        }, 200)
    }

    sendMessage() {

        console.log("Sending message");

        function recieveMessage(message) {
            console.log("Recieved message: " + message)
        }

        system.callServerMethod("sendMessage", document.getElementById("message").value, recieveMessage);
    }

    getMessage() {
        console.log("Getting...");
        system.callServerMethodWithNoReturn("getSomeValue", 0);
    }


    logout() {

        console.log("Logging out");

        function callback(success) {
            removeCookie("CelestisAccessToken");
            console.log("Logout done." + success);
        }

        function getToken(token) {
            system.callServerMethod("logout", {Token: token}, callback);
        }

        getCookie("CelestisAccessToken", getToken);
    }

    sendNotification() {
        system.callServerMethod("fcmTest", "pavlik.pocho@gmail.com", (string) => {
            console.log(string);
        })
    }

    openLoginWindow() {
        system.openWindow(<LoginDialog key={"loginDialog" + Math.floor(Math.random() * 1000)} windowId={"loginDialog" + Math.floor(Math.random() * 1000)} height="350" width="600"/>)
    }
    openSignupWindow() {
        system.openWindow(<RegisterDialog key={"registerDialog" + Math.floor(Math.random() * 1000)} windowId={"registerDialog" + Math.floor(Math.random() * 1000)} height="300" width="500"/>)
    }

    close() {
        document.getElementById(this.props.activityId).style.opacity = "0";
        document.getElementById(this.props.activityId).style.transform = "translateY(20px)";
        setTimeout(() => {
            system.returnToPrevActivity();
        }, 200);
    }

    render() {
        var messages = [];

        for (var i = 0; i < parseInt(this.props.messageLength); i ++) {
            messages.push(<p>This is a message!</p>);
        }

        var l = {
            subject: "Czinglish"
        }

        return (
            <Activity activityId={this.props.activityId}>
                <div className="startActivityMainArea">
                    <div className="startActivityLogoWrap">
                        <div className="startActivityLogo">LOGO</div>
                        <p className="startActivitySubtitle">Bla bla bla bla blablablablablablablablablablablabla</p>
                    </div>
                    <div className="startActivityButtonWrap">
                        <button className="openLoginWindow" onClick={() => {this.openLoginWindow()}}>Login</button>
                        <button className="openRegisterWindow" onClick={() => {this.openSignupWindow()}}>Sign Up</button>
                    </div>
                </div>
            </Activity>
        );
    }

}