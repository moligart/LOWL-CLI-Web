import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './HelpRow.css';

const HELP_TEXT = 'help';

export default class HelpRow extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showHelp: false,
            hasError: false,
            outputHeader: '',
            outputText: '',
            autoCmd: 'help',
        };

        this.toggleExpandedHelp = this.toggleExpandedHelp.bind(this);
        this.setStateHelper = this.setStateHelper.bind(this);
        this.autoCompleteCommand = this.autoCompleteCommand.bind(this);

        // Tutorial CLI
        this.checkInput = this.checkInput.bind(this);
        this.focusInput = this.focusInput.bind(this);
    }

    setStateHelper = (obj) => {
        this.setState(obj);
    }

    focusInput = () => {
        this.tutorialInput.focus();
    }

    toggleExpandedHelp = () => {
        const showHelp = !this.state.showHelp;
        const state = { showHelp };

        this.props.setTutorialState();

        if (showHelp) {
            setTimeout(() => {
                document.addEventListener('keydown', this.checkInput);
                this.focusInput();
            }, 25);
        } else {
            state.hasError = false;
            state.outputText = '';
            this.tutorialInput.value = '';
            document.removeEventListener('keydown', this.checkInput);
        }

        this.setStateHelper(state);
    }

    checkInput = (evt) => {
        if (evt.keyCode === 13) {
            const input = this.tutorialInput.value;
            let outputText;
            let hasError = true;
            let outputHeader = 'Nope...';

            if (input === HELP_TEXT) {
                outputHeader = 'Congrats! Easy, right?';
                outputText = 'A few things to keep in mind:\n' +
                             '1. All commands and their arguments are case sensitive, so \'HELP\' != \'help\'.\n' +
                             '2. Pay attention to any errors; they contain useful information that will help you progress.\n\n' +
                             'Now exit the tutorial and try the help command in the main command prompt.\n\n';
                hasError = false;
            } else if (input.toLowerCase() === HELP_TEXT) {
                outputText = `Command lines are case sensitive, including this one. ${input} != ${HELP_TEXT}`;
            } else if (!input) {
                outputText = 'You haven\'t entered anything.';
            } else {
                outputText = `Trouble spelling? ${input} != ${HELP_TEXT}`;
            }

            this.setStateHelper({
                hasError,
                outputHeader,
                outputText,
            });
        }
    }

    autoCompleteCommand = () => {
        this.props.autoCompleteCommand(this.state.autoCmd);
    }

    render() {
        const hideCSS = this.state.showHelp ? '' : 'hide';
        const messageCSS = this.state.hasError ? 'error-msg' : 'success-msg ';
        const showOutputCSS = this.state.outputText ? '' : 'hide';
        const showEndCSS = this.state.outputText && !this.state.hasError ? '' : 'hide';
        return (
            <div className="HelpRow-host">
                <pre>Use the <span className="cmd" onClick={this.autoCompleteCommand}>help</span> command at any time to see available commands and their usages.</pre>
                <pre>
                    <span className="cmd" onClick={this.toggleExpandedHelp} role="button" tabIndex="-1">Click here</span> if you are completely lost.
                </pre>
                <div className={`HelpRow-expandedHelp ${hideCSS}`}>
                    <pre>
                        Type <strong>help</strong> into the command prompt <strong>($)</strong> below, then press <strong>enter/return</strong>.
                    </pre>
                    $<input
                        type="text"
                        maxLength="4"
                        onBlur={this.focusInput}
                        ref={(input) => { this.tutorialInput = input; }}
                    />
                    <div className={`tutorial-msg ${messageCSS} ${showOutputCSS}`}>
                        <h3>{this.state.outputHeader}</h3>
                        <pre>{this.state.outputText}</pre>
                        <div className={showEndCSS}>
                            <hr />
                            <button className="cmd return-btn" onClick={this.toggleExpandedHelp}>Go back</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

HelpRow.propTypes = {
    autoCompleteCommand: PropTypes.func.isRequired,
    setTutorialState: PropTypes.func.isRequired,
};
