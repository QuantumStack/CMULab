const axios = require('axios');

// current version
const current = 'v1.3';
let latest;

// look for a new release on github
function check() {
  axios.get('https://api.github.com/repos/QuantumStack/CMULab/releases')
    .then((res) => {
      // save new version tag
      latest = res.data[0].tag_name;
    })
    .catch(() => {
      latest = current;
    });
}

// check for update at startup and every day after
check();
setInterval(check, 86400000);

// check if current is not equal to latest
module.exports = () => {
  if (current === latest) return { update: false };
  return { update: true, latest, current };
};
