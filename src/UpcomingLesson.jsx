import css from './UpcomingLesson.css';
import React from 'react';
import { system, url, subjects } from './index.jsx';

/*
lesson: {
    subject: [string]
    classroom: [string]
}
*/

export class UpcomingLesson extends React.Component {

    constructor(lesson) {
        super(lesson)
    }

    render() {

        if (this.props.lesson == null) return null;

        return (
            <div className="upcomingLesson">
                <h1>Upcoming lesson</h1>
                <p>{subjects[this.props.lesson.Subject.Name]}</p>
                <p>{this.props.lesson.Subject.Teacher.FirstName + this.props.lesson.Subject.Teacher.LastName}</p>
            </div>
        );
    }

}