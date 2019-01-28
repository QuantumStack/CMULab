const axios = require('axios');

const current = 'v1.2.3';
let latest;

function check() {
  axios.get('https://api.github.com/repos/QuantumStack/CMULab/releases')
    .then((res) => {
      latest = res.data[0].tag_name;
    })
    .catch(() => {
      latest = current;
    });
}

check();
setInterval(check, 86400000);

module.exports = () => {
  if (current === latest) return { update: false };
  return { update: true, latest, current };
};
