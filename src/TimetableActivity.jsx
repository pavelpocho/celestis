import React, { Fragment } from 'react';
import { Activity } from 'universal-app-platform';
import css from './TimetableActivity.css';
import { TopBar } from './TopBar.jsx';
import { EventList } from './EventList.jsx';
import { Timetable } from './Timetable.jsx';

export class TimetableActivity extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            timetable: null
        }
    }

    componentDidMount() {
        this.getTimetable();
    }

    close() {
        document.getElementById(this.props.activityId).style.opacity = "0";
        document.getElementById(this.props.activityId).style.transform = "translateY(20px)";
        setTimeout(() => {
            system.returnToPrevActivity();
        }, 200);
    }

    getTimetable() {
        console.log("Getting timetable");

        system.callServerMethod("getTimetable", 0, (data) => {
            console.log("Recieved events");
            console.log(data);
            this.setState({
                timetable: data
            })
        })
    }


    render() {
        console.log("Rendering timetable");
        console.log(this.state.timetable);
        return (
            <Activity activityId={this.props.activityId}>
                <TopBar config={1} title="Timetable" activity={this}/>
                <Timetable timetableObject={this.state.timetable} user={this.props.user}/>
            </Activity>
        );
    }

}