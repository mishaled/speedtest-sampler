const GoogleSpreadsheet = require('google-spreadsheet');
const util = require('util');
const creds = require('./google-generated-creds-secret.json');

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

async function writeEntry(entry) {
    const sheet = await getSheet();
    const flattenedObject = flattenObject(entry);
    const timestamp = new Date();
    const formattedDate = {
        Date: timestamp.toISOString(),
        Day: DAYS[timestamp.getDay()],
        Hour: timestamp.getHours(),
        Minutes: timestamp.getMinutes()
    };

    const getRows = util.promisify(sheet.getRows);
    let rows = await getRows();

    if (rows.length >= sheet.rowCount) {
        const resize = util.promisify(sheet.resize);
        await resize({ rowCount: sheet.rowCount + 100, colCount: 28 });
    }

    const setHeaderRow = util.promisify(sheet.setHeaderRow);
    await setHeaderRow([...Object.keys(formattedDate), ...Object.keys(flattenedObject)]);

    const addRow = util.promisify(sheet.addRow);
    const result = await addRow({
        ...formattedDate,
        ...flattenedObject
    });

    return result;
}

const getSheet = async () => {
    const doc = new GoogleSpreadsheet('1tpCvfKpOU0UdXhM_f_ARMMjQ6rx6VKjD7aT2KPBImek');

    const useServiceAccountAuth = util.promisify(doc.useServiceAccountAuth);
    const getInfo = util.promisify(doc.getInfo);

    await useServiceAccountAuth(creds);
    let info = await getInfo();
    return info.worksheets[0];
};

const flattenObject = (ob) => {
    let toReturn = {};

    for (let i in ob) {
        if (!ob.hasOwnProperty(i)) continue;

        if ((typeof ob[i]) == 'object') {
            let flatObject = flattenObject(ob[i]);
            for (let x in flatObject) {
                if (!flatObject.hasOwnProperty(x)) continue;

                toReturn[i + '.' + x] = flatObject[x];
            }
        } else {
            toReturn[i] = ob[i];
        }
    }
    return toReturn;
};

module.exports = { writeEntry };