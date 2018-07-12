import React, { Fragment } from 'react';
import { Activity } from 'universal-app-platform';
import css from './EventActivity.css';
import { TopBar } from './TopBar.jsx';
import { EventList } from './EventList.jsx';

export class EventActivity extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            events: null
        }
    }

    componentDidMount() {
        this.getEventList();
    }

    close() {
        document.getElementById(this.props.activityId).style.opacity = "0";
        document.getElementById(this.props.activityId).style.transform = "translateY(20px)";
        setTimeout(() => {
            system.returnToPrevActivity();
        }, 200);
    }

    getEventList() {
        console.log("Getting events");

        system.callServerMethod("getEventList", 0, (data) => {
            console.log("Recieved events");
            console.log(data);
            this.setState({
                events: data
            })
        })
    }


    render() {

        return (
            <Activity activityId={this.props.activityId}>
                <TopBar config={1} title="Events" activity={this}/>
                <EventList events={this.state.events} user={this.props.user}/>
            </Activity>
        );
    }

}