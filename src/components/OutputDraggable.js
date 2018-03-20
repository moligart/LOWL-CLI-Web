import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Draggable from 'react-draggable';
import OutputImage from './OutputImage';
import OutputPDF from './OutputPDF';
import { ROW_TYPES } from '../constants/constants';
import FocusService from '../services/focus-service';
import TrayService from '../services/tray-service';
import NotificationService, { NOTIF_HANDLE_FOCUS } from '../services/notification-service';
import './OutputDraggable.css';

const fs = new FocusService();
const ts = new TrayService();
const ns = new NotificationService();
let unmountingComponent;

export default class OutputDraggable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isMax: false,
            isMin: false,
            maxMinCSS: 'neutral',
            staticPos: null,
            dockedOffset: '',
            focusCSS: 'hasFocus',
        };

        this.removeComponent = this.removeComponent.bind(this);
        this.toggleMaximized = this.toggleMaximized.bind(this);
        this.toggleMinimized = this.toggleMinimized.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.gainedFocus = this.gainedFocus.bind(this);
        this.lostFocus = this.lostFocus.bind(this);
        this.setStateHelper = this.setStateHelper.bind(this);
    }

    componentDidMount() {
        ns.subscribe(NOTIF_HANDLE_FOCUS, this, this.handleFocus);
        fs.addComponent(this.props.rk);
        this.gainedFocus();
    }

    componentWillUnmount() {
        unmountingComponent = this.props.rk;
        ns.unsubscribe(NOTIF_HANDLE_FOCUS, this);
        fs.removeComponent(this.props.rk);
    }

    setStateHelper = (state) => {
        if (unmountingComponent && unmountingComponent === this.props.rk) {
            return;
        }
        this.setState(state);
    }

    removeComponent = () => {
        unmountingComponent = this.props.rk;
        ns.unsubscribe(NOTIF_HANDLE_FOCUS, this);
        fs.removeComponent(this.props.rk);
        ts.removeComponent(this);
        this.props.removeComponent(this.props.rk);
    }

    toggleMaximized = () => {
        const max = !this.state.isMax;
        const css = max ? 'maximized' : 'neutral';
        const pos = max ? { x: 0, y: 0 } : null;
        this.setStateHelper({
            isMax: max,
            isMin: false,
            maxMinCSS: css,
            staticPos: pos,
            dockedOffset: '',
        });

        this.gainedFocus();
        ts.removeComponent(this);
    }

    toggleMinimized = () => {
        const min = !this.state.isMin;
        const css = min ? 'minimized' : 'neutral';
        const pos = min ? { x: 0, y: 0 } : null;
        const offset = 100 * document.getElementsByClassName('minimized').length;
        const offsetStyle = `right: ${offset.toString()}px`;

        this.setStateHelper({
            isMax: false,
            isMin: min,
            maxMinCSS: css,
            staticPos: pos,
            dockedOffset: offsetStyle,
        });

        if (min) {
            this.lostFocus();
            ts.addComponent(this, this.toggleMinimized, this.removeComponent);
        } else {
            this.gainedFocus();
            ts.removeComponent(this);
        }
    }

    handleFocus = () => {
        const focusCSS = fs.hasFocus(this.props.rk) ? 'hasFocus' : '';
        this.setStateHelper({
            focusCSS,
        });
    }

    gainedFocus = () => {
        fs.gainedFocus(this.props.rk);
    }

    lostFocus = () => {
        fs.lostFocus(this.props.rk);
    }

    render() {
        const rowType = (item) => {
            switch (item.type) {
            case ROW_TYPES.ROW_TYPE_IMG:
                return (
                    <OutputImage row={item} />
                );
            case ROW_TYPES.ROW_TYPE_PDF:
                return (
                    <OutputPDF row={item} />
                );
            default:
                return null;
            }
        };

        return (
            <Draggable
                axis="both"
                handle=".handle"
                defaultPosition={{ x: 0, y: 0 }}
                position={this.state.staticPos}
                disabled={this.state.isMax || this.state.isMin}
                grid={[1, 1]}
                onStart={this.handleStart}
                onDrag={this.handleDrag}
                onStop={this.handleStop}
            >
                <div
                    className={`OutputDraggable-body handle ${this.state.maxMinCSS} ${this.state.focusCSS}`}
                    style={this.state.dockedOffset}
                    tabIndex="0"
                    onClick={this.gainedFocus}
                    ref={(div) => {
                        this.draggable_body = div;
                    }}
                >
                    <div className="option-bar">
                        <div className="option-container">
                            <div className="option">
                                <div className="circle red" onClick={this.removeComponent}>
                                    <span className="option-text exit" />
                                </div>
                            </div>
                            <div className="option" onClick={this.toggleMinimized}>
                                <div className="circle yellow">
                                    <span className="option-text minimize" />
                                </div>
                            </div>
                            <div className="option" onClick={this.toggleMaximized}>
                                <div className="circle green">
                                    <span className="option-text maximize" />
                                </div>
                            </div>
                        </div>
                        <div className="title">
                            {this.props.row.data.title}
                        </div>
                    </div>
                    <div>
                        {rowType(this.props.row)}
                    </div>
                </div>
            </Draggable>
        );
    }
}

OutputDraggable.propTypes = {
    removeComponent: PropTypes.func.isRequired,
    rk: PropTypes.string.isRequired,
    row: PropTypes.shape({
        body: PropTypes.string,
        host: PropTypes.string,
        disabled: PropTypes.bool,
        data: PropTypes.shape({
            title: PropTypes.string,
        }),
    }).isRequired,
};
