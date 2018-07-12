import css from './TimetableLessonMenu.css';
import React from 'react';
import { MainActivity } from './MainActivity.jsx';

export class TimetableLessonMenu extends React.Component {

    constructor(x, y) {
        super(x, y);
    }

    render() {
        return (
            <div className="timetableLessonMenuWrap" style={{top: this.props.y + "px", left: this.props.x + "px"}}>
            </div>
        );
    }
}