const fs = require('fs');

const SUB_PATH = "subs/";

function write(subName, pushMessageJSON) {
  return new Promise((resolve, reject) => {
    const jsonString = JSON.stringify(pushMessageJSON);
    fs.writeFile(SUB_PATH + subName, jsonString, { flag: 'w' }, err => {
      if (err) reject(err);

      resolve();
    });
  });
}

function read(subName) {
  return new Promise((resolve, reject) => {
    fs.readFile(SUB_PATH + subName, 'utf8', (err, data) => {
      if (err) reject(err);

      resolve(data);
    });
  });
}

module.exports = { write, read };