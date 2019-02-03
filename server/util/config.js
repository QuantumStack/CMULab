const fs = require('fs');
const configFile = require('./../config.json');

// configs interface
module.exports = {
  // get all configs directly
  all: () => configFile,
  // get config for a specfic key
  get: (key) => {
    const data = configFile[key];
    // throw an error if there's no data for the key
    if (data === null) throw new Error('Invalid config key');
    else return data;
  },
  // write a key-value pair
  write: (key, value) => {
    // throw an error if there was no existing data for the key
    if (configFile[key] === null) throw new Error('Invalid config key');
    // set the key in the configs object
    configFile[key] = value;
  },
  // save configs to disk
  save: (callback) => {
    // stringify json with 2-space indentation
    const json = JSON.stringify(configFile, null, 2);
    // write config.json
    fs.writeFile('./config.json', json, 'utf8', callback);
  },
};
