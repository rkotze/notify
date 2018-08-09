const fs = require("fs");

const SUB_PATH = "subs/";

const mkdirSync = function(dirPath) {
  try {
    fs.mkdirSync(dirPath);
  } catch (err) {
    if (err.code !== "EEXIST") throw err;
  }
};

function write(subName, pushMessageJSON) {
  mkdirSync(SUB_PATH);
  return new Promise((resolve, reject) => {
    const jsonString = JSON.stringify(pushMessageJSON);
    fs.writeFile(SUB_PATH + subName, jsonString, { flag: "w" }, err => {
      if (err) reject(err);

      resolve();
    });
  });
}

function read(subName) {
  return new Promise((resolve, reject) => {
    fs.readFile(SUB_PATH + subName, "utf8", (err, data) => {
      if (err) reject(err);

      resolve(data);
    });
  });
}

module.exports = { write, read };
