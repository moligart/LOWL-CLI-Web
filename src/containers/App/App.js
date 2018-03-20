import React, { Component } from 'react';
import './App.css';

import { ROW_TYPES, NEW_INPUT_FOR_TYPE } from '../../constants/constants';
import seedRows from '../../constants/seed';

import InputRow from '../../components/InputRow';
import HelpRow from '../../components/HelpRow';
import OutputRow from '../../components/OutputRow';
import OutputDraggable from '../../components/OutputDraggable';
import ItemTray from '../../components/ItemTray';

import HttpService from '../../services/http-service';
import CookieService from '../../services/cookie-service';

const http = new HttpService();
const cookies = new CookieService();

class App extends Component {
    constructor() {
        super();

        this.state = {
            rows: [],
            blockEnter: false,
            host: 'Lambents-MBP:~ lambentowl$',
            history: [],
            historyIndex: 0,
            inTutorial: false,
        };

        this.run = this.run.bind(this);
        this.init = this.init.bind(this);
        this.setStateHelper = this.setStateHelper.bind(this);
        this.handleEnter = this.handleEnter.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.blockEnterKey = this.blockEnterKey.bind(this);
        this.concatRows = this.concatRows.bind(this);
        this.disableInput = this.disableInput.bind(this);
        this.removeComponent = this.removeComponent.bind(this);
        this.scrollHistory = this.scrollHistory.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.addHistory = this.addHistory.bind(this);
        this.autoCompleteCommand = this.autoCompleteCommand.bind(this);
        this.setTutorialState = this.setTutorialState.bind(this);

        // Init data
        this.init();
    }

    /* Event hooks */
    componentDidMount() {
        seedRows((rows) => {
            this.setState({ rows });
        });

        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('click', this.handleClick);

        console.log('Oh hi. You won\'t find much in the dev console. Read the about.txt file in ~/Documents to learn why.');
    }

    setStateHelper = (obj) => {
        this.setState(obj);
    }

    setTutorialState = () => {
        const inTutorial = !this.state.inTutorial;
        this.setStateHelper({ inTutorial });

        if (inTutorial) {
            document.removeEventListener('keydown', this.handleKeyDown);
            document.removeEventListener('click', this.handleClick);
        } else {
            document.addEventListener('keydown', this.handleKeyDown);
            document.addEventListener('click', this.handleClick);
        }
    }

    blockEnterKey = (isBlocked) => {
        this.setStateHelper({ blockEnter: isBlocked });
    }

    handleKeyDown = (evt) => {
        window.scrollTo(0, document.body.scrollHeight);
        switch (evt.keyCode) {
        case 13:
            this.handleEnter(evt);
            break;
        case 38:
            this.scrollHistory(evt, this.state.historyIndex - 1);
            break;
        case 40:
            this.scrollHistory(evt, this.state.historyIndex + 1);
            break;
        case 9:
            evt.preventDefault();
            break;
        default:
            break;
        }
    }

    handleEnter = (evt) => {
        // If user hits enter, submit to server for validation.
        if (!this.state.blockEnter) {
            if (evt && evt.preventDefault) {
                evt.preventDefault();
            }

            const cmd = this.activeInput.getValue();

            this.disableInput(cmd);
            this.blockEnterKey(true);

            if (cmd) {
                this.addHistory(cmd);
                this.run(cmd);
            } else {
                // Add empty input line
                this.concatRows([{
                    type: ROW_TYPES.ROW_TYPE_INPUT,
                    host: this.state.host,
                    body: '',
                    disabled: false,
                }]);
                this.blockEnterKey(false);
            }
        }
    }

    addHistory = (cmd) => {
        let { historyIndex } = this.state;
        const { history } = this.state;
        history.splice(historyIndex);
        history.push(cmd);
        historyIndex = history.length;
        this.setStateHelper({
            historyIndex,
            history,
        });
    }

    scrollHistory = (evt, index) => {
        evt.preventDefault();

        const histLength = this.state.history.length - 1;
        const value = index > histLength || index < 0 ? '' : this.state.history[index];
        this.activeInput.setValue(value);

        this.setStateHelper({ historyIndex: index });
    }

    handleClick = () => {
        this.activeInput.setFocus();
    }

    concatRows = (newRows) => {
        this.setStateHelper({ rows: this.state.rows.concat(newRows) });
    }

    disableInput = (cmd, index) => {
        const { rows } = this.state;
        const idx = index || rows.length - 1;
        rows[idx].disabled = true;
        rows[idx].body = cmd;
        this.setStateHelper({ rows });
    }

    removeComponent = (componentRef) => {
        if (componentRef) {
            const index = componentRef.split('-')[1];
            const { rows } = this.state;
            const row = rows[index];
            row.body = '';
            row.type = '';
            rows[index] = row;
            this.setStateHelper({ rows });
        }
    }

    init = () => {
        const sid = cookies.getCookie('sid');

        http.init(sid)
            .then((data) => {
                cookies.setCookie('sid', data.sid);
            }, (err) => {
                console.log(err);
            });
    }

    run = (cmd) => {
        const sid = cookies.getCookie('sid');

        http.runCommand(sid, cmd)
            .then((data) => {
                console.log(data);

                if (data.type === ROW_TYPES.ROW_TYPE_INPUT) {
                    this.setStateHelper({ host: data.host });
                }

                const newRows = [data];

                if (NEW_INPUT_FOR_TYPE.indexOf(data.type) > -1) {
                    newRows.push({
                        type: ROW_TYPES.ROW_TYPE_INPUT,
                        host: data.host === '*' ? '>' : this.state.host,
                        body: '',
                        disabled: false,
                    });
                }

                this.concatRows(newRows);
            }, (err) => {
                console.log(err);
            })
            .then(this.blockEnterKey(false));
    }

    autoCompleteCommand = (cmd) => {
        this.activeInput.setValue(cmd);
        this.handleEnter();
    }

    render() {
        return (
            <div className="App">
                <HelpRow
                    autoCompleteCommand={this.autoCompleteCommand}
                    setTutorialState={this.setTutorialState}
                />
                {this.state.rows.map((item, index) => {
                    switch (item.type) {
                    case ROW_TYPES.ROW_TYPE_INPUT:
                        return (
                            <InputRow
                                ref={(input) => {
                                    if (!item.disabled) {
                                        this.activeInput = input;
                                    }
                                    return `in-${index}`;
                                }}
                                row={item}
                                key={index}
                            />
                        );
                    case ROW_TYPES.ROW_TYPE_OUTPUT:
                        return (
                            <OutputRow
                                ref={`out-${index}`}
                                row={item}
                                key={index}
                            />
                        );
                    case ROW_TYPES.ROW_TYPE_IMG:
                        return (
                            <OutputDraggable
                                ref={`prev-${index}`}
                                rk={`prev-${index}`}
                                row={item}
                                key={index}
                                removeComponent={this.removeComponent}
                            />
                        );
                    case ROW_TYPES.ROW_TYPE_PDF:
                        return (
                            <OutputDraggable
                                ref={`prev-${index}`}
                                rk={`prev-${index}`}
                                row={item}
                                key={index}
                                removeComponent={this.removeComponent}
                            />
                        );
                    default:
                        return <div key={`mt-${index}`} />;
                    }
                })}
                <ItemTray />
            </div>
        );
    }
}

export default App;
