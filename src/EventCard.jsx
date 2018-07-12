import React, { Component } from 'react';
import { system, subjects } from './index.jsx';
import { GradeAssignment } from './GradeAssignment.jsx';
import { EventCreator } from './EventCreator.jsx';
import css from './EventCard.css';

export class EventCard extends Component {

    constructor(props) {
        super(props);

        this.state = {
            gradeOptionsOpen: false
        }
    }

    toggleGradeOptions() {
        this.setState((prevState) => {
            return { gradeOptionsOpen: !prevState.gradeOptionsOpen }
        })
    }

    setGrade(event) {
        const object = {
            Grade: {
                Value: document.getElementById("gradeOptionsValue" + event.ID).value,
                Weight: document.getElementById("gradeOptionsWeight" + event.ID).value
            },
            Event: {
                ID: event.ID
            }
        }
        system.callServerMethod("setEventGrade", object, (success) => {
            console.log(success);
        });
        this.setState({
            currentlyGradeOptions: null
        });
    }

    editEvent(event) {
        this.setState({
            currentlyEdditing: event
        });
        system.openWindow(<EventCreator key={"eventCreatorWindow" + Math.floor(Math.random() * 1000)} windowId="eventCreator" height="400" width="500" existingEvent={event}/>);
    }

    deleteEvent(event) {
        system.callServerMethod("deleteEvent", event.ID, (success) => {
            console.log(success);
        })
    }

    finishEvent(event) {
        system.callServerMethod("finishEvent", event.ID, (success) => {
            console.log(success);
        })
    }

    openGradeAssignmentWindow(event) {
        system.callServerMethod("getEventGrades", event.ID, (setGradesModel) => {
            console.log(setGradesModel);
            system.openWindow(<GradeAssignment key={"gradeAssignmentWindow" + Math.floor(Math.random() * 1000)} height="500" width="400" windowId="gradeAssignment" event={event} existingGrades={setGradesModel}/>)
        });
    }

    showGradeOptions(event) {
        this.setState({
            currentlyGradeOptions: event
        });
    }

    render() {

        const lcDateString = this.props.event.UtcDate.toLocaleDateString().replace(/\//g, ".");

        if (this.state.gradeOptionsOpen) {
            return (
                <div className="eventCard">
                    <p>{lcDateString}</p>
                    <p>{this.props.event.Name}</p>
                    <p>{this.props.event.Description}</p>
                    <p>{subjects[this.props.event.Lessons[0].Subject.Name]}</p>
                    <input type="text" name="gradeValue" id={"gradeOptionsValue" + this.props.event.ID} />
                    <input type="text" name="gradeWeight" id={"gradeOptionsWeight" + this.props.event.ID} />
                    <button onClick={() => {this.setGrade(this.props.event)}}>Set grade</button>
                    <button onClick={() => {this.toggleGradeOptions()}}>Cancel</button>
                </div>
            )
        }

        const grade = this.props.event.Grade != null ? <p>{this.props.event.Grade.Value} @ {this.props.event.Grade.Weight}</p> : null;

        const teacherOptions = this.props.user.Role == 1 ? <button onClick={() => {this.openGradeAssignmentWindow(this.props.event)}}>Assign grades</button> : null;
        const studentOptions = this.props.user.Role == 0 ? <button onClick={() => {this.toggleGradeOptions(this.props.event)}}>Set grade</button> : null;
        return (
            <div className="eventCard">
                <p>{lcDateString}</p>
                <p>{this.props.event.Name}</p>
                <p>{this.props.event.Description}</p>
                <p>{subjects[this.props.event.Lessons[0].Subject.Name]}</p>
                {grade}
                <button onClick={() => this.editEvent(this.props.event)}>Edit</button>
                <button onClick={() => this.deleteEvent(this.props.event)}>Delete</button>
                <button onClick={() => this.finishEvent(this.props.event)}>Finish</button>
                {teacherOptions}
                {studentOptions}
            </div>
        );
    }

}