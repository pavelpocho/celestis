import css from './EventCreator.css';
import React from 'react';
import { system } from './index.jsx';
import { Window } from 'universal-app-platform';
import { getUtcTime, getLocalTime } from './DateFormatter.js';

/*
EventType = enum (
    0 => Exam,
    1 => Homework,
    2 => LessonException
)

Lesson = {
    ID: int,
    Subject: {
        ID: int,
        Name: int (enum),
        Teacher: {User}
    },
    LessonTime: {
        DayOfWeek: int,
        UtcHours: int,
        UtcMinutes: int
    }
}

public class Event
{
    public int ID { get; set; }
    public EventType Type { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public ICollection<Lesson> Lessons { get; set; }
    public DateTime UtcDate { get; set; }
    public Difficulty Difficulty { get; set; }
    public User Owner { get; set; }
}
*/

export class EventCreator extends React.Component {

    constructor(props) {
        super(props);

        console.log(this.props);

        if (this.props.date != null && this.props.lesson != null) {
            this.props.date.setHours(this.props.lesson.LessonTime.UtcHours);
            this.props.date.setMinutes(this.props.lesson.LessonTime.UtcMinutes);
        }
    }

    sendEvent() {
        var eventObject;

        if (this.props.existingEvent) {
            eventObject = {
                ID: this.props.existingEvent.ID,
                Name: document.getElementById("eventCreatorName").value,
                Description: document.getElementById("eventCreatorDescription").value
            }
        }
        else {
            eventObject = {
                Type: this.props.eventType,
                Lessons: [this.props.lesson],
                Name: document.getElementById("eventCreatorName").value,
                Description: document.getElementById("eventCreatorDescription").value,
                UtcDate: this.props.date != null ? this.props.date : getUtcTime(document.getElementById("eventCreatorDate").value)
            }
        }
        if (this.props.eventType < 2) {
            eventObject.Difficulty = document.getElementById("eventCreatorDifficulty").value;
        }

        system.callServerMethod("createEvent", eventObject, (success) => {
            console.log(success);
        })
    }

    render() {

        const existingName = this.props.existingEvent != null ? this.props.existingEvent.Name : "";
        const existingDescription = this.props.existingEvent != null ? this.props.existingEvent.Description : "";
        const existingDifficulty = this.props.existingEvent != null ? this.props.existingEvent.Difficulty : "";
        const existingDate = this.props.existingEvent != null ? this.props.existingEvent.UtcDate : "";

        var dateInput = this.props.date == null ? <input type="text" placeholder="Date" id="eventCreatorDate" defaultValue={existingDate} /> : null;

        if (this.props.existingEvent != null && this.props.existingEvent.Lessons != null) {
            dateInput = null;
        }

        const extra = (this.props.eventType < 2 || this.props.existingEvent.Type < 2) ? <input type="text" placeholder="Difficulty" id="eventCreatorDifficulty" defaultValue={existingDifficulty}/> : null;

        return (
            <Window windowId={this.props.windowId} height={this.props.height} width={this.props.width} system={system}>
                <div className="eventCreatorWrap">
                    <input type="text" placeholder="Name" id="eventCreatorName" defaultValue={existingName}/>
                    <input type="text" placeholder="Description" id="eventCreatorDescription" defaultValue={existingDescription}/>
                    {dateInput}
                    {extra}
                    <button onClick={() => {this.sendEvent()}}>Save</button>
                </div>
            </Window>
        );
    }
}