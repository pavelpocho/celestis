//Assume all inputs are in local time
//Do not send local time to the server

export function getUtcTime(date) {
    return new Date(date.getTime() + (date.getTimezoneOffset()) * 60000);
}

export function getLocalTime(date) {
    return new Date(date.getTime() - (date.getTimezoneOffset()) * 60000);
}