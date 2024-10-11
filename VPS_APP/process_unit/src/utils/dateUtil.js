export const getDateTimeNow = (beautyFormat = true) => {
    const date = new Date();

    const options = {
        timeZone: 'Asia/Singapore',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        fractionalSecondDigits: 3,
        hour12: false,
    };

    const dateTimeFormat = new Intl.DateTimeFormat('en-GB', options);

    const [{ value: day }, , { value: month }, , { value: year }, , { value: hour }, , { value: minute }, , { value: second }] = dateTimeFormat.formatToParts(date);

    const milliseconds = String(date.getMilliseconds()).padStart(3, '0');

    const isoString = `${year}-${month}-${day}T${hour}:${minute}:${second}.${milliseconds}`;

    if (beautyFormat) {
        return `${day}/${month}/${year} ${hour}:${minute}:${second}:${milliseconds}`
    }
    return isoString
}