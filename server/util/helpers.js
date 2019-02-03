const moment = require('moment');
const convertDate = require('./convertDate');

// various helper functions, used mainly when rendering hbs templates
module.exports = {
  // round to 2 decimal places
  round: n => Math.round(n * 100) / 100,
  // remove duplicates from an array and sort based on frequency
  freqreduce: (arr) => {
    const freqs = {};
    arr.forEach((item) => {
      if (!freqs[item]) freqs[item] = 0;
      freqs[item] += 1;
    });
    return Object.entries(freqs).sort((a, b) => b[1] - a[1])
      .map(([item]) => item).join(', ');
  },
  // create a range from n to m
  range: (n, m) => {
    const L = [];
    for (let i = n; i <= m; i += 1) L.push(i);
    return L;
  },
  // check if an object is non-empty
  isNonEmpty: (obj) => {
    let o = obj;
    if (obj.toJSON) o = obj.toJSON();
    return Object.keys(o).length > 0;
  },
  // convert json to string
  toString: a => JSON.stringify(a),
  // prettify time interval
  prettyDiff: diff => moment.duration(diff).humanize(),
  // prettify time interval to minutes
  prettyMs: ms => moment.duration(ms, 'ms').minutes(),
  // convert date to course timezone and prettify it
  prettyDate: (date) => {
    const d = convertDate(moment(date), -1, false);
    return d.format('dd YYYY-MM-DD HH:mm:ss');
  },
  // convert true to 'checked'
  checked: val => (val ? 'checked' : ''),
  // convert 2 strings to 'selected' if they are equal
  selected: (val1, val2) => (val1 === val2 ? 'selected' : ''),
  // or condition
  or: (v1, v2) => Boolean(v1 || v2),
};
