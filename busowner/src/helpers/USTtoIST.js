function convertUtcToIst(utcDateStr) {
    const utcDate = new Date(utcDateStr);
    const offset = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(utcDate.getTime() + offset);

    return istDate.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
}

function convertUtcToIst2(utcDateStr) {
    const utcDate = new Date(utcDateStr);
    const offset = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(utcDate.getTime() + offset);

    return istDate.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: 'numeric',
        month: 'long', 
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    });
}

export { convertUtcToIst, convertUtcToIst2 }
