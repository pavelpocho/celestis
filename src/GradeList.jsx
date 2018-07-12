import css from './GradeList.css';
import React from 'react';
import { system, subjects as _subjects } from './index.jsx';
import { Window } from 'universal-app-platform';
import { getUtcTime, getLocalTime } from './DateFormatter.js';
import { EventWindow } from './EventWindow.jsx';

export class GradeList extends React.Component {

    constructor(props) {
        super(props);
    }

    openEventWindow(event) {
        system.openWindow(<EventWindow key={"EventWindow" + Math.floor(Math.random() * 1000)} windowId={"EventWindow" + Math.floor(Math.random() * 1000)} height="400" width="400" event={event}></EventWindow>);
    }

    render() {

        console.log("Starting grade list render");

        if (this.props.grades == null) return null;
        const subjects = [];
        const weights = [];
        this.props.grades.map((grade) => {
            var addS = true;
            for (var i = 0; i < subjects.length; i++) {
                if (subjects[i].ID == grade.Subject.ID) {
                    addS = false;
                }
            }
            console.log(subjects);
            if (addS) subjects.push(grade.Subject);
            var addW = true;
            for (var i = 0; i < weights.length; i++) {
                if (weights[i] == grade.Grade.Weight) {
                    addW = false;
                }
            }
            if (addW) weights.push(grade.Grade.Weight);
        });

        const rows = [];
        for (var i = 0; i < weights.length; i++) {
            rows[i] = [];
            for (var j = 0; j < subjects.length; j++) {
                rows[i][j] = <td key={i * j + j}></td>
            }
        }

        this.props.grades.map((grade, index) => {
            var i = 0;
            for (i; i < subjects.length; i++) {
                if (subjects[i].ID == grade.Subject.ID) break;
            }

            var j = 0;
            for (j; j < weights.length; j++) {
                if (weights[j] == grade.Grade.Weight) break;
            }

            rows[j][i] = <td key={index}><button onClick={() => {this.openEventWindow(grade.Event)}}>{grade.Grade.Value}</button></td>
        });

        const subjectRow = subjects.map((subject, index) => {
            return <th key={index}>{_subjects[subject.Name]}</th>
        });

        const otherRows = weights.map((weight, index) => {
            return (
                <tr key={index}>
                    <th>{weight}</th>
                    {rows[index]}
                </tr>
            )
        })

        return (
            <div className="gradeListWrap">
                <table>
                    <thead>
                        <tr>
                            <th>---</th>
                            {subjectRow}
                        </tr>
                    </thead>
                    <tbody>
                        {otherRows}
                    </tbody>
                </table>
            </div>
        );
    }
}