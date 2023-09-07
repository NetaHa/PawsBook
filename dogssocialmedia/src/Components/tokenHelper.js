import jwt from 'jsonwebtoken';

export const getToken = () => {
    const name = 'authToken=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i].trim();
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return "";
}

export const getLoggedInUserIdFromToken = () => {
    const token = getToken();
    const decoded = jwt.decode(token);
    return decoded ? decoded.userId : null;
}
