export default class CookieService {
    getCookie = (cookieName) => {
        const name = `${cookieName}=`;
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i += 1) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return '';
    }

    setCookie = (cookieName, value) => {
        document.cookie = `${cookieName}=${value};path=/`;
    }
}
