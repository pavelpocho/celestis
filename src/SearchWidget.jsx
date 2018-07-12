import React, { Component } from 'react';
import css from './SearchWidget.css';
import { WindowBackground } from './WindowBackground.jsx';

export class SearchWidget extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            open: false
        }
    }

    toggleState() {
        this.setState((prevState) => {
            return {
                open: !prevState.open
            }
        })
    }

    windowBackgroundClicked(id) {
        if (id == 0) {
            this.toggleState();
        }
    }

    render() {
        if (this.state.open) {
            return (
                <React.Fragment>
                    <WindowBackground parent={this} id={0}/>
                    <div className="searchWidgetWrap sWWOpen">
                        <i className="material-icons searchWidgetExpandedIcon">search</i>
                        <input type="text" placeholder="Search" className="searchWidgetInput" />
                    </div>
                </React.Fragment>
            )
        }
        else {
            return (
                <div>
                    <button className="mainTopBarSearchButton" onClick={() => {this.toggleState()}}>
                        <i className="material-icons">search</i>
                    </button>
                </div>
            )
        }
    }

}