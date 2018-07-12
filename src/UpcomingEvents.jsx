import css from './UpcomingEvents.css';
import React from 'react';
import { Window } from 'universal-app-platform';
import { EventCreator } from './EventCreator.jsx';
import { EventCard } from './EventCard.jsx';
import { getLocalTime } from './DateFormatter';

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

export class UpcomingEvents extends React.Component {

    constructor(props) {
        super(props);
        this.state = { currentlyEdditing: null, currentlyGradeOptions: null }
    }

    render() {

        if (this.props.eventArray == null || this.props.eventArray.length == 0) return null;

        const eventList = this.props.eventArray.map((value, index) => {
            value.UtcDate = getLocalTime(new Date(value.UtcDate));
            return <EventCard user={this.props.user} event={value} key={index}/>            
        })

        return (
            <div className="upcomingEventsWrap">
                {eventList}
            </div>
        );
    }
}