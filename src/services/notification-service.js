export const NOTIF_HANDLE_FOCUS = 'handle_focus';
export const NOTIF_TOGGLE_MAXIMIZED = 'toggle_maximized';

let instance = null;
const listeners = {};

export default class NotificationService {
    constructor() {
        if (!instance) {
            instance = this;
        }

        return instance;
    }

    post = (notifName, data) => {
        const lsnrs = listeners[notifName];

        for (let i = 0; i < lsnrs.length; i += 1) {
            const obj = lsnrs[i];
            obj.callback(data);
        }
    }

    subscribe = (notifName, listener, callback) => {
        const obj = {
            listener,
            callback,
        };

        const lsnrs = listeners[notifName];

        if (!lsnrs) {
            listeners[notifName] = [];
        }

        listeners[notifName].push(obj);
    }

    unsubscribe = (notifName, listener) => {
        const lsnrs = listeners[notifName];

        if (lsnrs) {
            for (let i = 0; i < lsnrs.length; i += 1) {
                if (listener.props.rk === lsnrs[i].listener.props.rk) {
                    lsnrs.splice(i, 1);
                    listeners[notifName] = lsnrs;
                    break;
                }
            }
        }
    }
}
