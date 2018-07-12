import css from './Timetable.css';
import React from 'react';
import { system, subjects } from './index.jsx';
import { TimetableLessonMenu } from './TimetableLessonMenu.jsx';
import { EventCreator } from './EventCreator.jsx';
import { getLocalTime } from './DateFormatter';

/*
timetableObject {
    ID: int,
    Lessons: [
        {
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
    ]
}
*/

export class Timetable extends React.Component {

    constructor(props) {
        super(props);

        const dates = [];

        for (var i = 0; i < 7; i++) {
            dates[i] = new Date();
            dates[i].setHours(0);
            dates[i].setMinutes(0);
            dates[i].setSeconds(0);
            dates[i].setMilliseconds(0);
            dates[i].setDate(dates[i].getDate() - dates[i].getDay() + 1 + i);
        }

        this.state = {
            openLessonIndex: null,
            dates: dates
        }
    }

    addLesson(i, j) {
        this.props.createTimetable.addLesson(i, j);
    }

    showLessonMenu(lessonIndex) {
        this.setState({
            openLessonIndex: lessonIndex
        });
    }

    openEventCreator(eventTypeInt, lesson, date) {
        system.openWindow(<EventCreator key={"eventCreatorWindow" + Math.floor(Math.random() * 1000)} windowId="eventCreatorWindow" height="300" width="400" eventType={eventTypeInt} lesson={lesson} date={date}/>);
    }

    shiftWeeks(shiftBy) {
        const dates = this.state.dates;

        for (var i = 0; i < 7; i++) {
            dates[i].setDate(dates[i].getDate() + 7 * shiftBy);
        }

        this.setState({
            dates: dates
        });
    }

    render() {

        var times = [];

        if (this.props.timeObject != null) {
            times = this.props.timeObject;
        }

        if (this.props.timetableObject == null && this.props.timeObject == null) return null;

        var days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        var timeArr;

        if (this.props.timetableObject != null) {
            timeArr = this.props.timetableObject.Lessons.map((element) => {
                if (element == null) return null;
                var t = {
                    UtcHours: element.LessonTime.UtcHours,
                    UtcMinutes: element.LessonTime.UtcMinutes
                }
                return t;
            })
        }

        if (times.length == 0 && timeArr != undefined) {
            timeArr.map((element) => {
                if (element == null) return null;
                for (var f = 0; f < times.length; f++) {
                    if (times[f].UtcMinutes == element.UtcMinutes && times[f].UtcHours == element.UtcHours) {
                        return;
                    }
                }

                times.push(element);
            })
        }

        const timeElements = times.map((value, index) => {
            var dateObj = new Date();
            dateObj.setHours(value.UtcHours);
            dateObj.setMinutes(value.UtcMinutes);
            var loc = getLocalTime(dateObj);
            return <th key={index}>{loc.getHours()}:{loc.getMinutes()}</th>
        });

        const bodyRows = [];
        for (var x = 0; x < days.length; x++) {
            bodyRows[x] = [];
            for (var y = 0; y < times.length; y++) {
                bodyRows[x][y] = <td key={x + "" + y}></td>
            }
        }

        if (this.props.timetableObject != null) {
            this.props.timetableObject.Lessons.map((value, index) => {
                if (value == null) return;
                var i = value.LessonTime.DayOfWeek - 1;
                if (i < 0) i += 7;

                var j;
                for (var k = 0; k < times.length; k++) {
                    if (value.LessonTime.UtcHours == times[k].UtcHours && value.LessonTime.UtcMinutes == times[k].UtcMinutes) {
                        j = k;
                        break;
                    }
                }

                var events;
                if (value.Events != null) {
                    events = value.Events.map((value, index) => {
                        if (
                            getLocalTime(new Date(value.UtcDate)).getFullYear() != this.state.dates[i].getFullYear() ||
                            getLocalTime(new Date(value.UtcDate)).getMonth() != this.state.dates[i].getMonth() ||
                            getLocalTime(new Date(value.UtcDate)).getDate() != this.state.dates[i].getDate()
                        ) return null;

                        if (value.Finished == true) {
                            return <p key={index} className="finishedTimetableEvent">{value.Name}</p>
                        }
                        else {
                            return <p key={index}>{value.Name}</p>
                        }
                    });
                }

                if (this.state.openLessonIndex == index) {
                    bodyRows[i][j] = <td key={index * 1000}><div><p>{subjects[value.Subject.Name]}</p><button onClick={() => {this.openEventCreator(1, value, this.state.dates[i])}}>Homework</button><button onClick={() => {this.openEventCreator(1, value, this.state.dates[i])}}>Exam</button></div></td>;
                }
                else if (this.props.createTimetable == null) {
                    bodyRows[i][j] = <td key={index * 1000}>
                        <button onClick={() => {this.showLessonMenu(index)}}>{subjects[value.Subject.Name]}</button>
                        {events}
                    </td>;
                }
                else {
                    bodyRows[i][j] = <td key={index * 1000}>{subjects[value.Subject.Name]}</td>;
                }
                
            });
        }

        if (this.props.createTimetable != null) {
            for (var i = 0; i < bodyRows.length; i++) {
                for (var j = 0; j < bodyRows[i].length; j++) {
                    if (bodyRows[i][j].key == i + "" + j) {
                        const k = i;
                        const l = j;
                        bodyRows[i][j] = <td key={i + "" + j}><button onClick={() => {this.addLesson(k, l)}}>+</button></td>
                    }
                }
            }
        }

        const dateElems = this.state.dates.map((date) => {
            if (this.props.createTimetable != null) return "";
            return date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear();
        })

        const bodyRowsWithTitles = days.map((value, index) => {
            return (<tr key={index}><th>{value + " " + dateElems[index]}</th>{bodyRows[index]}</tr>)
        })

        const pageSwitcher = this.props.createTimetable == null ? (
            <div className="timetablePageSwitcher">
                    <button className="timetablePageButton" onClick={() => {this.shiftWeeks(-1)}}>{"<"}</button>
                    <button className="timetablePageButton" onClick={() => {this.shiftWeeks(1)}}>{">"}</button>
                </div>
        ) : null;

        return (
            <div className="timetableWrap">
                <table>
                    <tbody>
                        <tr>
                            <th>
                                ----
                            </th>
                            {timeElements}
                        </tr>
                        {bodyRowsWithTitles}
                    </tbody>
                </table>
                {pageSwitcher}
            </div>
        );
    }
}