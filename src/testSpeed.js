const speedTest = require('speedtest-net');
const test = speedTest({ maxTime: 1000 });

const testSpeed = () => {
    return new Promise((resolve, reject) => {
        test.on('data', data => {
            resolve(data);
        });

        test.on('error', err => {
            reject(err);
        });
    });
}

module.exports = { testSpeed };
