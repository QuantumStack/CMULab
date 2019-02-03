const config = require('./config');

// convert date from course to UTC
// if s = -1, convert date from UTC to course timezone
// if v = false, return a moment object instead of ms since epoch
module.exports = (m, s = 1, v = true) => {
  const hours = config.get('offsetHours') * s;
  const minutes = config.get('offsetMinutes') * s;
  const adj = m.add({ hours, minutes });

  if (v) return adj.valueOf();
  return adj;
};
