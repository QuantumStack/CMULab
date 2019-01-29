const fs = require('fs');
const configFile = require('./../config.json');

// TODO: migrator from .env

module.exports = {
  get: (key) => {
    const data = configFile[key];
    if (data === null) throw new Error('Invalid config key');
    else return data;
  },
  write: (key, value) => {
    configFile[key] = value;

    const json = JSON.stringify(configFile);
    fs.writeFile('./../config.json', json, 'utf8', (err) => {
      if (err) throw err;
    });
  },
};
