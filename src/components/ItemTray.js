import React, { Component } from 'react';
import NotificationService, { NOTIF_TOGGLE_MAXIMIZED } from '../services/notification-service';
import './ItemTray.css';

const ns = new NotificationService();

export default class ItemTray extends Component {
    constructor(props) {
        super(props);

        this.state = {
            rows: [],
            minimized: false,
        };

        this.setRows = this.setRows.bind(this);
        this.setStateHelper = this.setStateHelper.bind(this);
        this.minimize = this.minimize.bind(this);
    }

    componentDidMount() {
        ns.subscribe(NOTIF_TOGGLE_MAXIMIZED, this, this.setRows);
    }

    componentWillUnmount() {
        ns.unsubscribe(NOTIF_TOGGLE_MAXIMIZED, this);
    }

    setStateHelper = (state) => {
        this.setState(state);
    }

    setRows = (rows) => {
        this.setStateHelper({ rows });
    }

    minimize = () => {
        const minimized = !this.state.minimized;
        this.setStateHelper({ minimized });
    }

    render() {
        const isHidden = () => {
            return this.state.rows.length === 0 ? 'hidden' : '';
        };

        const isMinimized = () => {
            return this.state.minimized ? 'tray-closed' : 'tray-open';
        };

        const chevronDirection = () => {
            return this.state.minimized ? '' : 'bottom';
        };

        return (
            <div className={`ItemTray-container ${isHidden()} ${isMinimized()}`}>
                <div className="toggleBox" onClick={this.minimize}>
                    <span className={`chevron ${chevronDirection()}`} onClick={this.minimize} />
                </div>
                {this.state.rows.map((item, index) => {
                    return (
                        <div
                            className="tray-item"
                            key={`tray-${index}`}
                            onClick={item.toggleMinMax}
                        >
                            <div className="option-bar">
                                <div className="option-container">
                                    <div className="option">
                                        <div className="circle red" onClick={item.remove}>
                                            <span className="option-text exit" />
                                        </div>
                                    </div>
                                </div>
                                <div className="title">
                                    {item.obj.props.row.data.title}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }
}
