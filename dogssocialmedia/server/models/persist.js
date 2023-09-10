const fs = require('fs');
const path = require('path');

const USERS_PATH = path.join(__dirname, 'data', 'users.json');
const POSTS_PATH = path.join(__dirname, 'data', 'posts.json');
const TEST_DATA_PATH = path.join(__dirname, 'data', 'data-test.json');

function readData(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, "utf8", (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(data));
            }
        });
    });
}

function writeData(filePath, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, JSON.stringify(data, null, 2), { encoding: "utf8", flag: "w" }, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

module.exports = {
    USERS_PATH,
    POSTS_PATH,
    TEST_DATA_PATH,
    readData,
    writeData
};
