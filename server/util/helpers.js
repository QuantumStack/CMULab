const moment = require('moment');
const convertDate = require('./convertDate');

module.exports = {
  round: n => Math.round(n * 100) / 100,
  freqreduce: (arr) => {
    const freqs = {};
    arr.forEach((item) => {
      if (!freqs[item]) freqs[item] = 0;
      freqs[item] += 1;
    });
    return Object.entries(freqs).sort((a, b) => b[1] - a[1])
      .map(([item]) => item).join(', ');
  },
  range: (n, m) => {
    const L = [];
    for (let i = n; i <= m; i += 1) L.push(i);
    return L;
  },
  isNonEmpty: (obj) => {
    let o = obj;
    if (obj.toJSON) o = obj.toJSON();
    return Object.keys(o).length > 0;
  },
  toString: a => JSON.stringify(a),
  prettyDiff: diff => moment.duration(diff).humanize(),
  prettyMs: ms => moment.duration(ms, 'ms').minutes(),
  prettyDate: (date) => {
    const d = convertDate(moment(date), -1, false);
    return d.format('dd YYYY-MM-DD HH:mm:ss');
  },
  checked: val => (val ? 'checked' : ''),
  selected: (val1, val2) => (val1 === val2 ? 'selected' : ''),
  or: (v1, v2) => Boolean(v1 || v2),
};
