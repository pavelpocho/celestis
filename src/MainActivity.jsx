import React, { Fragment } from 'react';
import { Activity } from 'universal-app-platform';
import { UpcomingLesson } from './UpcomingLesson.jsx';
import { getCookie, removeCookie } from './index.jsx';
import { StartActivity } from './StartActivity.jsx';
import { CreateTimetable } from './CreateTimetable.jsx';
import { AccountSettings } from './AccountSettings.jsx';
import { Timetable } from './Timetable.jsx';
import { UpcomingEvents } from './UpcomingEvents.jsx';
import { EventList } from './EventList.jsx';
import { GradeList } from './GradeList.jsx';
import { SchoolSelector } from './SchoolSelector.jsx';
import css from './MainActivity.css';
import { MainBottomBar } from './MainBottomBar.jsx';
import { TopBar } from './TopBar.jsx';

export class MainActivity extends React.Component {

    constructor(props) {
        super(props)

        console.log(this.props.user);
        
        this.state = { timetableObject: null, upcomingLesson: null, upcomingEvents: null, events: null }

        this.getMainScreenData();
    }

    componentDidMount() {
        this.getMainScreenData();
        setTimeout(() => {
            system.clearActivityStack();
        }, 200);
    }

    close() {
        document.getElementById(this.props.activityId).style.opacity = "0";
        document.getElementById(this.props.activityId).style.transform = "translateY(20px)";
        setTimeout(() => {
            system.returnToPrevActivity();
        }, 200);
    }

    getMainScreenData() {
        console.log("Getting data..");

        system.callServerMethod("getMainScreenData", 0, (data) => {
            console.log("Recieved Data");
            console.log(data);
            this.setState(() => {
                return {
                    timetableObject: data.Timetable,
                    upcomingLesson: data.UpcomingLesson,
                    upcomingEvents: data.UpcomingEvents
                }
            })
        });
    }

    sendMeEmail() {
        system.callServerMethod("sendMeEmail", 0, int => {
            console.log(int);
        })
    }

    openSchoolSelector() {
        console.log("TERM");
        console.log(this.props.user.Term);
        if (this.props.user.Term != null) return;
        system.callServerMethod("getTermList", 0, (termList) => {
            system.openWindow(<SchoolSelector user={this.props.user} key={"gradeList" + Math.round(Math.random() * 1000)} grades={this.state.grades} windowId={"gradeList" + Math.round(Math.random() * 1000)} height="500" width="400" terms={termList}/>);
        })
    }

    render() {

        return (
            <Fragment>
                <Activity activityId={this.props.activityId}>
                    <div id="mainActivityInner">
                        <TopBar config={0} title={"Overview"} user={this.props.user}/>
                        {/*<UpcomingLesson lesson={this.state.upcomingLesson}/>
                        <CreateTimetable/>
                        <Timetable timetableObject={this.state.timetableObject} createTimetable={null} timeObject={null}/>
                        <UpcomingEvents eventArray={this.state.upcomingEvents} user={this.props.user}/>
                        <button onClick={() => {this.logout()}}>Log out</button>
                        <button onClick={() => {this.getMainScreenData()}}>Get data</button>
                        <button onClick={() => {this.getEventList()}}>Get event list</button>
                        <button onClick={() => {this.getGradeList()}}>Get grade list</button>
                        <button onClick={() => {this.sendMeEmail()}}>Send me an email pls</button>
                        <button onClick={() => {this.openSchoolSelector()}}>Open school selector</button>
                        <AccountSettings/>
                        <EventList events={this.state.events} user={this.props.user}/>
                        <GradeList grades={this.state.grades} />*/}
                        <UpcomingLesson lesson={this.state.upcomingLesson}/>
                        <Timetable timetableObject={this.state.timetableObject} createTimetable={null} timeObject={null}/>
                        <UpcomingEvents eventArray={this.state.upcomingEvents} user={this.props.user}/>
                    </div>
                </Activity>
                <MainBottomBar user={this.props.user}/>
            </Fragment>
        );
    }

}