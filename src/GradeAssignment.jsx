import css from './GradeAssignment.css';
import React from 'react';
import { MainActivity } from './MainActivity.jsx';
import { Window } from 'universal-app-platform';

export class GradeAssignment extends React.Component {

    constructor(props) {
        super(props);

        var students = [];

        this.props.event.Lessons.map(element => {
            element.Students.map(student => {
                var contains;
                for (var i = 0; i < students.length; i++) {
                    if (students[i].ID == student.ID) {
                        contains = true;
                        break;
                    }
                }
                if (!contains) students.push(student);
            });
        });

        this.state = {
            students: students
        }
    }

    submitGrades() {
        var object = {
            SetGrades: [],
            EventId: this.props.event.ID,
            Weight: document.getElementById("gradeAssignmentWeight").value
        };
        for (var i = 0; i < document.getElementsByClassName("gradeAssignmentInput").length; i++) {
            object.SetGrades.push({
                UserId: document.getElementsByClassName("gradeAssignmentInput")[i].name,
                GradeValue: document.getElementsByClassName("gradeAssignmentInput")[i].value
            });
        }

        system.callServerMethod("assignEventGrades", object, (success) => {
            console.log(success);
        });
    }

    render() {

        const fields = this.state.students.map((student, index) => {

            var grade = null;

            for (var i = 0; i < this.props.existingGrades.SetGrades.length; i++) {
                if (this.props.existingGrades.SetGrades[i].UserId == student.ID) {
                    grade = this.props.existingGrades.SetGrades[i].GradeValue;
                    break;
                }
            }

            return (
                <li key={index}>
                    <p>{student.FirstName + " " + student.LastName}</p>
                    <input type="text" className="gradeAssignmentInput" name={student.ID} defaultValue={grade == 0 ? "" : grade}/>
                </li>
            )
        });

        const weight = this.props.existingGrades != null ? this.props.existingGrades.Weight : null;

        return (
            <Window windowId={this.props.windowId} height={this.props.height} width={this.props.width} system={system}>
                <div className="gradeAssignmentWrap">
                    <p>Assign grades</p>
                    <input type="text" id="gradeAssignmentWeight" placeholder="Weight" defaultValue={weight == 0 ? "" : weight}/>
                    <ul>
                        {fields}
                    </ul>
                    <button className="gradeAssignmentSubmit" onClick={() => {this.submitGrades()}}>Save grades</button>
                </div>
            </Window>
        );
    }
}