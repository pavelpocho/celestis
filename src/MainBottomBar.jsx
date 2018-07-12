import css from './MainBottomBar.css';
import React, { Component } from 'react';
import { EventActivity } from './EventActivity.jsx';
import { GradeActivity } from './GradeActivity.jsx';
import { TimetableActivity } from './TimetableActivity.jsx';

export class MainBottomBar extends React.Component {

    openActivity(a) {
        if (a == 0) {
            system.startActivity(<EventActivity activityId="eventActivity" key="eventActivity" user={this.props.user}/>);
        }
        else if (a == 1) {
            system.startActivity(<GradeActivity activityId="gradeActivity" key="gradeActivity" user={this.props.user}/>);
        }
        else if (a == 2) {
            system.startActivity(<TimetableActivity activityId="timetableActivity" key="timetableActivity" user={this.props.user}/>);
        }
    }

    render() {
        return (
            <div className="mainBottomBar">
                <button className="bottomBarButton" onClick={() => {this.openActivity(0)}}>
                    <i className="material-icons">event</i>
                    <p>Events</p>
                </button>
                <button className="bottomBarButton" onClick={() => {this.openActivity(1)}}>
                    <i className="material-icons">grade</i>
                    <p>Grades</p>
                </button>
                <button className="bottomBarButton" onClick={() => {this.openActivity(2)}}>
                    <i className="material-icons">event_note</i>
                    <p>Timetable</p>
                </button>
            </div>
        );
    }
}
    