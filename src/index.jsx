//The css HAS to be here!
import css from './main.css';
import { System, App } from "universal-app-platform";
import { hubConnection } from 'signalr-no-jquery';
import React from "react";
import { StartActivity } from "./StartActivity.jsx";
import { MainActivity } from './MainActivity.jsx';
import { subjects as _subjects, weekdays as _weekdays } from "./strings-en.json";
import { getUtcTime, getLocalTime } from './DateFormatter.js';

import { saveCookie as saveCookieF, getCookie as getCookieF, removeCookie as removeCookieF, googleSignIn as googleSignInF, facebookSignIn as facebookSignInF, facebookSignInRerequest as facebookSignInRerequestF } from "./browserFunctions.js";
//import { saveCookie as saveCookieF, getCookie as getCookieF, removeCookie as removeCookieF, googleSignIn as googleSignInF, facebookSignIn as facebookSignInF, facebookSignInRerequest as facebookSignInRerequestF } from "./electronFunctions.js";

export const saveCookie = saveCookieF;
export const getCookie = getCookieF;
export const removeCookie = removeCookieF;
export const googleSignIn = googleSignInF;
export const facebookSignIn = facebookSignInF;
export const facebookSignInRerequest = facebookSignInRerequestF;

export const subjects = _subjects;
export const weekdays = _weekdays;

//export const url = "https://www.avegrade.com";
export const url = "http://localhost:19712";

export const functions = "./browserFunctions.js";
//export const functions = "./electronFunctions.js";

class CelestisApp extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            windows: [],
            activities: [],
            historyId: null,
            activityIndex: -1,
            connection: null,
            proxy: null
        }

        window.system = this;

        window.onpopstate = function() {
            this.system.closeActivity();
        }
        
        window.onbeforeunload = function() {
            window.history.pushState(null, "", "#");
            this.system.state.connection.stop();
        }
    }

    closeTopWindow(moveUp) {
        if (this.state.windows.length == 1) return;
        document.getElementById(this.state.windows[this.state.windows.length - 1].props.windowId).style.opacity = "0";
        document.getElementById(this.state.windows[this.state.windows.length - 1].props.windowId).style.transform = moveUp ? "translateY(-20px)" : "translateY(20px)";
        setTimeout(() => {
            system.closeWindow(this.state.windows.length - 1);
        }, 200);
    }

    clearActivityStack() {
        this.setState((prevState) => {
            var arr = prevState.activities;
            arr.splice(0, arr.length - 1);
            return {
                activities: arr,
                activityIndex: 0
            }
        });
    }

    closeActivity() {
        if (this.state.activities.length == 1) return;
        document.getElementById(this.state.activities[this.state.activityIndex].props.activityId).style.opacity = "0";
        document.getElementById(this.state.activities[this.state.activityIndex].props.activityId).style.transform = "translateY(20px)";
        setTimeout(() => {
            system.returnToPrevActivity();
        }, 200);
    }

    componentDidMount() {
        this.setSignalRUrl(url + "/signalr");
        this.addServerEventHandler("recieveMessage", () => {
            console.log("Recieved a message...");
        });
        this.addServerEventHandler("recieveSomeValue", (someValue) => {
            console.log(someValue);
        });
        this.init();
    }    
    
    init() {
        this.connectToServer(() => {
            getCookie("CelestisAccessToken", (tokenValue) => {
                if (tokenValue == undefined || tokenValue == null) {
                    console.log("starting start activity");
                    document.getElementById("root").style.opacity = "1";
                    document.body.removeChild(document.getElementById("mainLoadingSpinner"));
                    this.startActivity(<StartActivity activityId="startActivity" system={this} key="startActivity"/>);
                    return;
                }
                this.callServerMethod('tokenCheck', tokenValue, (user) => {
                    console.log(user);
                    document.getElementById("root").style.opacity = "1";
                    document.body.removeChild(document.getElementById("mainLoadingSpinner"));
                    if (user != null && user != undefined) {
                        this.startActivity(<MainActivity activityId="mainActivity" user={user} system={this} key="mainActivity"/>);
                    }
                    else {
                        this.startActivity(<StartActivity activityId="startActivity" system={this} key="startActivity"/>);
                        removeCookie("CelestisAccessToken");
                    }
                });
            });
        });
    }

    returnToPrevActivity() {
        this.setState((prevState) => {
            if (prevState.activityIndex == 0) {
                return { activityIndex: prevState.activityIndex };
            }

            var acts = prevState.activities;
            acts.splice(acts.length - 1, 1);

            return {
                activityIndex: prevState.activityIndex - 1,
                activities: acts
            }
        });
    }

    startActivity(activity) {
        this.setState((prevState) => {
            var acts = prevState.activities;
            acts[prevState.activityIndex + 1] = activity;
            acts = acts.slice(0, prevState.activityIndex + 2);

            return {
                activities: acts,
                activityIndex: acts.length - 1
            }
        });
        for (var i = 0; i < this.state.windows.length; i++) {
            this.closeWindow(i);
        }
    }

    openWindow(window) {
        var windowsLength = this.state.windows.length;
        console.log("opening window");
        this.setState((prevState) => {
            var wins = prevState.windows;
            wins.push(window);
            return {
                windows: wins
            }
        })
        return windowsLength;
    }

    closeWindow(index) {
        this.setState((prevState) => {
            var wins = prevState.windows;
            wins.splice(index, 1);
            return {
                windows: wins
            }
        })
    }
    
    getWindowZ() {
        return this.state.windows.length + 5;
    }

    //NOTE: At lease one event handler must be registered before connecting to the server.
    addServerEventHandler(name, callback) {
        if (this.state.connection == null) {
            this.state.connection = hubConnection(url);
            this.state.proxy = this.state.connection.createHubProxy('mainHub');
        }
        this.state.proxy.on(name, callback);
    }

    setSignalRUrl(url) {
        if (this.state.connection == undefined) {
            this.state.connection = hubConnection(url);
            this.state.proxy = this.state.connection.createHubProxy('mainHub');
        }
    }

    connectToServer(callback) {
        this.state.connection.start().done(callback);
    }

    getConnection() {
        return this.state.proxy;
    }

    callServerMethod(name, args, callback) {
        this.state.proxy.invoke(name, args).done(function(arg1, arg2, arg3, arg4, arg5) {
            callback(arg1, arg2, arg3, arg4, arg5);
        }).fail(function(error) {
            console.log(("Something went wrong.. " + error));
        });
    }

    render() {
        const activities = this.state.activities.map((act) => {
            return act;
        })
        console.log("Rendering...");
        console.log(this.state.windows);
        const windows = this.state.windows.map((window) => {
            return window;
        })
        return (
            <div id={this.props.appId}>
                {activities}
                {windows}
            </div>
        )
    }

}

System.renderApp(<CelestisApp />, document.getElementById("root"));