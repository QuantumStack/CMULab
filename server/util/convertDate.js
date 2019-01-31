const config = require('./config');

module.exports = (m, s = 1, v = true) => {
  const hours = config.get('offsetHours') * s;
  const minutes = config.get('offsetMinutes') * s;
  const adj = m.add({ hours, minutes });

  if (v) return adj.valueOf();
  return adj;
};
