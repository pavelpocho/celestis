import css from './SchoolSelector.css';
import React from 'react';
import { system, saveCookie } from './index.jsx';
import { Window } from 'universal-app-platform';
import { getLocalTime } from './DateFormatter.js';
import { MainActivity } from './MainActivity.jsx';

export class SchoolSelector extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            creatorOpen: false,
            teacherPickerOpen: false,
            teacherArr: null,
            teacherTerm: null
        }
    }

    openCreator() {
        this.setState({
            creatorOpen: true
        })
    }

    createSchool() {
        const termObject = {
            School: {
                Name: document.getElementById("schoolName").value,
                City: document.getElementById("schoolCity").value
            },
            Start: document.getElementById("termStart").value,
            End: document.getElementById("termEnd").value
        }

        system.callServerMethod("assignUserToTerm", termObject, (success) => {
            console.log(success);
        });
    }

    joinSchool(term) {
        if (this.props.user.Role == 1) {
            system.callServerMethod("assumeTeacherIdentity", term, (userArr) => {
                this.setState({
                    teacherPickerOpen: true,
                    teacherArr: userArr,
                    teacherTerm: term
                })
            });
        }
        else if (this.props.user.Role == 0) {
            system.callServerMethod("assignUserToTerm", term, (success) => {
                console.log(success);
            });
        }
    }

    selectTeacher(teacher) {
        system.callServerMethod("assignTeacherIdentity", { Term: this.state.teacherTerm, Teacher: teacher }, (user) => {
            if (user == null || user == undefined) {
                console.log("Relog failed..");
                return;
            }
            saveCookie("CelestisAccessToken", user.AccessToken);
            system.startActivity(<MainActivity activityId="mainActivity" user={user}/>);
        })
    }

    render() {

        if (this.props.terms == null) return null;

        if (this.state.teacherPickerOpen) {

            const teacherArr = this.state.teacherArr.map((teacher, index) => {
                return (
                    <div key={index} className="schoolSelectorTeacherWrap">
                        <p>{teacher.FirstName}</p>
                        <p>{teacher.LastName}</p>
                        <button onClick={() => {this.selectTeacher(teacher)}}>This is me</button>
                    </div>
                )
            })

            return (
                <Window windowId={this.props.windowId} height={this.props.height} width={this.props.width} system={system}>
                    <div className="schoolSelector">
                        {teacherArr}
                    </div>
                </Window>
            )
        }

        if (this.state.creatorOpen) {
            return (
                <Window windowId={this.props.windowId} height={this.props.height} width={this.props.width} system={system}>
                    <div className="schoolSelector">
                        <input type="text" name="schoolName" id="schoolName"></input>
                        <input type="text" name="schoolCity" id="schoolCity"></input>
                        <input type="date" name="termStart" id="termStart"></input>
                        <input type="date" name="termEnd" id="termEnd"></input>
                        <button onClick={() => {this.createSchool()}}></button>
                    </div>
                </Window>
            )
        }

        const termElems = this.props.terms.map((term, index) => {
            return (
                <div className="schoolSelectorTerm" key={index}>
                    <p>{term.School.Name}</p>
                    <p>{term.School.City}</p>
                    <p>{getLocalTime(new Date(term.Start)).toString()}</p>
                    <p>{getLocalTime(new Date(term.End)).toString()}</p>
                    <button onClick={() => {this.joinSchool(term)}}>Join this school</button>
                </div>
            )
        })

        return (
            <Window windowId={this.props.windowId} height={this.props.height} width={this.props.width} system={system}>
                <div className="schoolSelector">
                    <p>You are not a part of a school. Select a school to unlock all the features.</p>
                    {termElems}
                    <button onClick={() => {this.openCreator()}}>Create a school</button>
                </div>
            </Window>
        );
    }
}