import React from 'react';
import css from './TopBar.css';
import { MainMenu } from './MainMenu.jsx';
import { WindowBackground } from './WindowBackground.jsx';
import { SearchWidget } from './SearchWidget.jsx';

export class TopBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            mainMenuOpen: false
        }
    }

    openMainMenu() {
        this.setState({
            mainMenuOpen: true
        })
    }

    windowBackgroundClicked(id) {
        if (id == 0) {
            document.getElementsByClassName("mainMenuWrap")[0].style.transform = "translateY(-20px)";
            document.getElementsByClassName("mainMenuWrap")[0].style.opacity = "0";
            setTimeout(() => {
                this.setState({
                    mainMenuOpen: false
                })
            }, 200);  
        }
    }

    render() {

        const mainMenu = this.state.mainMenuOpen ? <React.Fragment><MainMenu user={this.props.user}/><WindowBackground id={0} parent={this}/></React.Fragment> : null;

        if (this.props.config == 0) {
            return (
                <div className="mainTopBar">
                    <div className="mainTopBarInner">
                        <div className="leftBarArea">
                            <button className="mainTopBarMenuButton" onClick={() => {this.openMainMenu()}}>
                                <i className="material-icons">menu</i>
                            </button>
                            <p className="mainTopBarTitle">{this.props.title}</p>
                        </div>
                        <SearchWidget />
                        {mainMenu}
                    </div>
                </div>
            )
        }
        else {
            return (
                <div className="mainTopBar">
                    <div className="mainTopBarInner">
                        <div className="leftBarArea">
                            <button className="mainTopBarMenuButton" onClick={() => {this.props.activity.close()}}>
                                <i className="material-icons">arrow_back</i>
                            </button>
                            <p className="mainTopBarTitle">{this.props.title}</p>
                        </div>
                        <SearchWidget />
                    </div>
                </div>
            )
        }
    }
}
