import css from './MainMenu.css';
import React from 'react';
import { RippleManager, RippleTouchManager } from 'universal-app-platform/src/RippleManager';
import { getCookie, removeCookie } from './index.jsx';
import { StartActivity } from './StartActivity.jsx'; 

export class MainMenu extends React.Component {

    constructor(props) {
        super(props);
        console.log(this.props.user);
    }

    logout() {
        console.log("Logging out..");

        function callback(success) {
            removeCookie("CelestisAccessToken");
            system.startActivity(<StartActivity activityId="startActivity" key="startActivity"/>);
        }

        function getToken(token) {
            system.callServerMethod("logout", { Token: token }, callback);
        }

        getCookie("CelestisAccessToken", getToken);
    }

    componentDidMount() {
        setTimeout(() => {
            document.getElementsByClassName("mainMenuWrap")[0].style.transform = "translateY(0px)";
            document.getElementsByClassName("mainMenuWrap")[0].style.opacity = "1";
        }, 20);
        RippleManager.setUp();
        RippleTouchManager.setUp();
    }

    render() {
        return (
            <div className="mainMenuWrap">
                <p>Welcome</p>
                <p>{this.props.user.FirstName + " " + this.props.user.LastName}</p>
                <button className="mainMenuButton">Account settings</button>
                <button className="mainMenuButton">Feedback</button>
                <button className="mainMenuButton" onClick={() => {this.logout()}}>Log out</button>
            </div>
        );
    }
}