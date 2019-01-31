const fs = require('fs');
const configFile = require('./../config.json');

// TODO: migrator from .env

module.exports = {
  all: () => configFile,
  get: (key) => {
    const data = configFile[key];
    if (data === null) throw new Error('Invalid config key');
    else return data;
  },
  write: (key, value) => {
    if (configFile[key] === null) throw new Error('Invalid config key');

    configFile[key] = value;

    const json = JSON.stringify(configFile, null, 2);
    fs.writeFile('./config.json', json, 'utf8', (err) => {
      if (err) throw err;
    });
  },
};
