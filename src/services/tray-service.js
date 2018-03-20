import NotificationService, { NOTIF_TOGGLE_MAXIMIZED } from './notification-service';

const ns = new NotificationService();

let instance = null;
const components = [];

export default class TrayService {
    constructor() {
        if (!instance) {
            instance = this;
        }

        return instance;
    }

    addComponent = (obj, toggleMinMax, remove) => {
        const item = {
            obj,
            toggleMinMax,
            remove,
        };
        components.push(item);
        this.doPost();
    }

    doPost = () => {
        ns.post(NOTIF_TOGGLE_MAXIMIZED, components);
    }

    removeComponent = (item) => {
        for (let i = 0; i < components.length; i += 1) {
            if (components[i].obj === item) {
                components.splice(i, 1);
                break;
            }
        }

        this.doPost();
    }
}
