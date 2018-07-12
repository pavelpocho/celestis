import React, { Fragment } from 'react';
import { Activity } from 'universal-app-platform';
import css from './GradeActivity.css';
import { TopBar } from './TopBar.jsx';
import { GradeList } from './GradeList.jsx';

export class GradeActivity extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            grades: null
        }
    }

    componentDidMount() {
        this.getGradeList();
    }

    close() {
        document.getElementById(this.props.activityId).style.opacity = "0";
        document.getElementById(this.props.activityId).style.transform = "translateY(20px)";
        setTimeout(() => {
            system.returnToPrevActivity();
        }, 200);
    }

    getGradeList() {
        console.log("Getting grades");

        system.callServerMethod("getGradeList", 0, (data) => {
            console.log("Recieved grades");
            console.log(data);
            this.setState({
                grades: data
            })
        })
    }

    render() {

        return (
            <Activity activityId={this.props.activityId}>
                <TopBar config={1} title="Grades" activity={this}/>
                <GradeList grades={this.state.grades} user={this.props.user}/>
            </Activity>
        );
    }

}