import css from './CreateTimetable.css';
import React from 'react';
import { system, subjects, weekdays } from './index.jsx';
import { Timetable } from './Timetable.jsx';
import { getUtcTime } from './DateFormatter.js';

export class CreateTimetable extends React.Component {

    constructor() {
        super();

        var times = ["8:40", "9:35", "10:40", "11:35", "12:30", "13:25", "14:20", "15:15", "16:10"];
        var timeObject = times.map((time, index) => {

            var dateObj = new Date();
            dateObj.setHours(time.split(":")[0]);
            dateObj.setMinutes(time.split(":")[1]);
            var utc = getUtcTime(dateObj);

            return {
                UtcHours: utc.getHours(),
                UtcMinutes: utc.getMinutes()
            }
        });

        var lessons = [];

        for (var i = 0; i < 7; i++) {
            lessons[i] = [];
            for (var j = 0; j < times.length; j++) {
                lessons[i][j] = null;
            }
        }

        console.log("Lessons: ");
        console.log(lessons);

        this.state = { lessons: lessons, timetableLessons: null, timeObject: timeObject, displayLesson: null, lessonExists: false };

    }

    createDisplayLesson() {
        var lesson = {
            Subject: {
                Name: document.getElementById("name").value,
                Teacher: {
                    FirstName: document.getElementById("teacherName").value.split(" ")[0],
                    LastName: document.getElementById("teacherName").value.split(" ")[1]
                }
            }
        }
        this.setState({
            displayLesson: lesson
        })
    }

    addLesson(i, j) {

        var l = this.state.lessons;
        var x = this.state.displayLesson;
        console.log("State Display Lesson Again:");
        console.log(x);
        x.LessonTime = {
            DayOfWeek: i + 1 > 6 ? i - 6 : i + 1,
            UtcHours: this.state.timeObject[j].UtcHours,
            UtcMinutes: this.state.timeObject[j].UtcMinutes,
        }
        l[i][j] = {
            LessonTime: {
                DayOfWeek: i + 1 > 6 ? i - 6 : i + 1,
                UtcHours: this.state.timeObject[j].UtcHours,
                UtcMinutes: this.state.timeObject[j].UtcMinutes,
            },
            Subject: {
                Name: x.Subject.Name,
                Teacher: {
                    FirstName: x.Subject.Teacher.FirstName,
                    LastName: x.Subject.Teacher.LastName
                }
            },
            Students: []
        };

        console.log("Lesson Array:");
        console.log(l);

        var tL = [];

        for (var g = 0; g < l.length; g++) {
            for (var h = 0; h < l[i].length; h++) {
                tL.push(l[g][h]);
            }
        }

        console.log("Timetable Lessons:");
        console.log(tL);

        this.setState({
            timetableLessons: tL,
            lessons: l,
            lessonExists: true
        });
    }

    sendTimetable() {

        var serverArray = [];
        
        for (var i = 0; i < this.state.timetableLessons.length; i++) {
            if (this.state.timetableLessons[i] != null) serverArray.push(this.state.timetableLessons[i]);
        }

        var timetable = {
            Lessons: serverArray
        }
        console.log(timetable);

        system.callServerMethod("addTimetable", timetable, (response) => {
            console.log(response);
        })
    }

    render() {
        console.log("rendering");

        const timetableObject = this.state.lessonExists ? {
            Lessons: this.state.timetableLessons
        } : null;

        const subjectDropdown = subjects.map((subject, index) =>
            <option value={index} key={index}>{subject}</option>
        )

        /*const dayDropdown = weekdays.map((day, index) =>
            <option value={index} key={index}>{subject}</option>
        )*/

        const displayLesson = this.state.displayLesson == null ? null : (
            <div id="displayLesson">
                    <p id="displayLessonName">{subjects[this.state.displayLesson.Subject.Name]}</p>
                    <p id="displayLessonTeacher">{this.state.displayLesson.Subject.Teacher.FirstName} {this.state.displayLesson.Subject.Teacher.LastName}</p>
            </div>
        )

        console.log(timetableObject);

        return (
            <div className="createTimetableWrap">
                <select id="name" name="name">
                    {subjectDropdown}
                </select>
                {/*<input type="text" id="time" placeholder="Lesson time (object {dayofweek (int), utcTime (datetime)})"/>*/}
                {/*<input type="text" id="day" placeholder="Day of week"/>*/}
                {/*<select id="day" name="day">
                    {dayDropdown}
                </select>*/}
                <input type="text" id="teacherName" placeholder="Teacher name (Fistname Lastname)"/>
                <button onClick={() => {this.createDisplayLesson()}}>Add lesson</button>
                <button onClick={() => {this.sendTimetable()}}>Send timetable</button>
                {displayLesson}
                <Timetable timetableObject={timetableObject} timeObject={this.state.timeObject} createTimetable={this}/>
            </div>
        );
    }
}