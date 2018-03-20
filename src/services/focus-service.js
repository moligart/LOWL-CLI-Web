import NotificationService, { NOTIF_HANDLE_FOCUS } from './notification-service';

const ns = new NotificationService();

let instance = null;
const components = [];
let focusedElem;

export default class FocusService {
    constructor() {
        if (!instance) {
            instance = this;
        }

        return instance;
    }

    hasFocus = (item) => {
        return item && focusedElem === item;
    }

    gainedFocus = (item) => {
        focusedElem = item;
        this.doPost();
    }

    lostFocus = (item) => {
        focusedElem = focusedElem === item ? null : focusedElem;
        this.doPost();
    }

    addComponent = (item) => {
        components.push(item);
        this.doPost();
    }

    doPost = () => {
        ns.post(NOTIF_HANDLE_FOCUS, components);
    }

    removeComponent = (item) => {
        for (let i = 0; i < components.length; i += 1) {
            if (components[i] === item) {
                if (focusedElem === item) {
                    focusedElem = null;
                }
                components.splice(i, 1);
                break;
            }
        }
    }
}
