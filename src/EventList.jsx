import css from './EventList.css';
import React from 'react';
import { MainActivity } from './MainActivity.jsx';
import { EventCard } from './EventCard.jsx';
import { getLocalTime } from './DateFormatter.js';

export class EventList extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        if (this.props.events == null) return null;

        const events = this.props.events.map((value, index) => {
            value.UtcDate = getLocalTime(new Date(value.UtcDate));
            return <EventCard user={this.props.user} event={value} key={index}/>            
        })

        return (
            <div className="eventListWrap">
                {events}
            </div>
        )
    }
}