import css from './EventWindow.css';
import React from 'react';
import { system, subjects as _subjects } from './index.jsx';
import { Window } from 'universal-app-platform';
import { getUtcTime, getLocalTime } from './DateFormatter.js';

export class EventWindow extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Window windowId={this.props.windowId} height={this.props.height} width={this.props.width} system={system}>
                <div className="eventWindowWrap">
                    <p>{this.props.event.Name}</p>
                    <p>{this.props.event.Description}</p>
                    <p>{getLocalTime(new Date(this.props.event.UtcDate)).toString()}</p>
                </div>
            </Window>
        );
    }
}