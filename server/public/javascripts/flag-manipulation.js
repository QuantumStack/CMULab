function flagDismiss() {
  document.getElementById('flags').classList.add('is-hidden');
  document.getElementById('main').classList.remove('is-fullheight-with-navbar');
  document.getElementById('main').classList.add('is-fullheight');
}

function flagOverride() {
  const override = document.getElementById('override').value;
  if (override) {
    document.getElementById('flag-toggle').innerHTML = 'Override';
    document.getElementById('override').value = '';
    document.getElementById('flag-icon').classList.add('fa-exclamation-triangle');
    document.getElementById('flag-icon').classList.remove('fa-check');
    document.getElementById('flag-notification').classList.add('is-danger');
    document.getElementById('flag-notification').classList.remove('is-warning');
    document.getElementById('flags').classList.add('is-danger');
    document.getElementById('flags').classList.remove('is-warning');
  } else {
    document.getElementById('flag-toggle').innerHTML = 'Flag';
    document.getElementById('override').value = 'good';
    document.getElementById('flag-icon').classList.remove('fa-exclamation-triangle');
    document.getElementById('flag-icon').classList.add('fa-check');
    document.getElementById('flag-notification').classList.remove('is-danger');
    document.getElementById('flag-notification').classList.add('is-warning');
    document.getElementById('flags').classList.remove('is-danger');
    document.getElementById('flags').classList.add('is-warning');
  }
}
