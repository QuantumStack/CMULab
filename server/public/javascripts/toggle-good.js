function toggleGood(id) {
  const good = document.getElementById(`${id}-good`).innerHTML === 'true';
  axios.post('/admin/togglegood', {
    _id: id,
    good: !good,
  }).then((res) => {
    if (res.status === 200) {
      const valid = document.getElementById(`${id}-valid`);
      const anyway = document.getElementById(`${id}-anyway`).classList;
      const check = document.getElementById(`${id}-check`).classList;
      if (good) {
        valid.classList.remove('has-text-danger');
        valid.classList.add('has-text-success');
        valid.innerHTML = 'valid';
        anyway.remove('is-hidden');
        check.add('is-hidden');
      } else {
        valid.classList.remove('has-text-success');
        valid.classList.add('has-text-danger');
        valid.innerHTML = 'invalid';
        anyway.add('is-hidden');
        check.remove('is-hidden');
      }
      document.getElementById(`${id}-good`).innerHTML = (!good).toString();
      toggleDropdown(`dropdown-${id}`);
    }
  }).catch((err) => {
    if (err) window.location = '/error';
  });
}
