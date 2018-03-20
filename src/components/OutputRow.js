import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './OutputRow.css';

export default class OutputRow extends Component {
    constructor(props) {
        super(props);

        this.state = {
            lines: props.row.body,
            toDisplay: [],
        };

        this.setStateHelper = this.setStateHelper.bind(this);
    }

    componentDidMount() {
        let i = 0;
        const that = this;
        const { lines, toDisplay } = this.state;

        if (lines instanceof Array) {
            const itv = setInterval(() => {
                if (i < lines.length) {
                    toDisplay.push(lines[i]);
                    that.setStateHelper({ toDisplay });
                    window.scrollTo(0, document.body.scrollHeight);
                    i += 1;
                } else {
                    clearInterval(itv);
                }
            }, 25);
        } else {
            toDisplay.push(lines);
            this.setStateHelper({ toDisplay });
            setTimeout(() => {
                window.scrollTo(0, document.body.scrollHeight);
            }, 25);
        }
    }

    setStateHelper = (obj) => {
        this.setState(obj);
    }

    render() {
        const hideIfEmpty = this.props.row.body ? '' : 'hide';
        return (
            <div className={`OutputRow-body ${hideIfEmpty}`}>
                {this.state.toDisplay.map((item, index) => {
                    return <pre key={`sub-${index}`}>{item}</pre>;
                })}
            </div>
        );
    }
}

OutputRow.propTypes = {
    row: PropTypes.shape({
        body: PropTypes.any,
        host: PropTypes.string,
        disabled: PropTypes.bool,
    }).isRequired,
};

