import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './InputRow.css';

export default class InputRow extends Component {
    constructor(props) {
        super(props);

        this.getValue = this.getValue.bind(this);
        this.setValue = this.setValue.bind(this);
        this.setFocus = this.setFocus.bind(this);
    }

    getValue = () => {
        return this.cmd_prompt.value;
    }

    setValue = (value) => {
        this.cmd_prompt.value = value;
        this.cmd_prompt.selectionEnd = 10000;
        this.cmd_prompt.selectionStart = this.cmd_prompt.selectionEnd;
    }

    setFocus = () => {
        this.cmd_prompt.focus();
    }

    render() {
        return (
            <div className="InputRow-host">
                <span>{this.props.row.host}</span>
                <input
                    type="text"
                    ref={(input) => {
                        if (input) {
                            input.focus();
                        }
                        this.cmd_prompt = input;
                    }}
                    disabled={this.props.row.disabled}
                    defaultValue={this.props.row.body}
                    autoCapitalize="false"
                    autoComplete="false"
                    autoCorrect="false"
                    spellCheck="false"
                />
            </div>
        );
    }
}

InputRow.propTypes = {
    row: PropTypes.shape({
        body: PropTypes.string,
        host: PropTypes.string,
        disabled: PropTypes.bool,
    }).isRequired,
};
