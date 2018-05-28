export default {
    UNKNOWN: 0,
    WINDOWS: 1,
    LINUX: 2,
    OSX: 3,
    getPlatform() {
        let userAgent = navigator.userAgent;
        if (/Windows/.test(userAgent)) {
            return 1;
        } else if (/Linux/.test(userAgent)) {
            return 2;
        } else if (/OS X/.test(userAgent)) {
            return 3;
        }
        return 0;
    }
}