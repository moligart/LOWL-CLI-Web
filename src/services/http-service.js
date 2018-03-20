import 'whatwg-fetch';

const headers = new Headers({
    'Content-Type': 'application/json',
    Accept: 'application/json',
});

export default class HttpService {
    runCommand = (sid, cmd) => {
        return new Promise((resolve, reject) => {
            const payload = {
                sid,
                cmd,
            };

            fetch('/api/cli/run', {
                method: 'POST',
                headers,
                body: this.buildPayload(payload),
            }).then((res) => {
                resolve(res.json());
            });
        });
    }

    init = (sid) => {
        return new Promise((resolve, reject) => {
            const payload = {
                sid,
            };

            fetch('/api/init', {
                method: 'POST',
                headers,
                body: JSON.stringify(payload),
            }).then((res) => {
                resolve(res.json());
            });
        });
    }

    buildPayload = (payload) => {
        return JSON.stringify(payload);
    }
}
