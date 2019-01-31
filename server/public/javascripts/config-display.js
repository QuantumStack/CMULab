function toggleThreshold() {
  const check = document.getElementById('attempts').checked;
  const type = document.getElementById('attempts-type').value;
  const field = document.getElementById('attempts-threshold').classList;
  if (check === false || type === 'section') {
    field.add('is-hidden');
  } else if (type === 'time') {
    field.remove('is-hidden');
  }
}
function toggleSectionWarn() {
  const check1 = document.getElementById('section').checked;
  const check2 = document.getElementById('attempts').checked;
  const box = document.getElementById('section-data').classList;
  if (check1 || check2) {
    box.remove('is-hidden');
  } else {
    box.add('is-hidden');
  }
}
toggleThreshold();
toggleSectionWarn();
