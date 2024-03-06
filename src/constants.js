let md5 = require('js-md5');

function createDate() {
    let currentDate = new Date();

    let year = currentDate.getFullYear();
    let month = currentDate.getMonth() + 1;
    let day = currentDate.getDate();

    if (String(month).length === 1) {
        month = `0${month}`;
    }
    if (String(day).length === 1) {
        day = `0${day}`;
    }
    return `Valantis_${year}${month}${day}`;
}

const hash = md5(createDate());

export const PAGE_LIMIT = 50;

export const fetchOwnOptions = {
    method: 'POST',
    headers: {
        'X-Auth': hash,
        'Content-type': 'application/json',
    },
};
