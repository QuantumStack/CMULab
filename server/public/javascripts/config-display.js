function toggleStudentWarn() {
  const check1 = document.getElementById('ghosts').checked;
  const check2 = document.getElementById('section').checked;
  const box = document.getElementById('student-data').classList;
  if (check1 || check2) {
    box.remove('is-hidden');
  } else {
    box.add('is-hidden');
  }
}

function toggleThreshold() {
  const check = document.getElementById('attempts').checked;
  const type = document.getElementById('attempts-type').value;
  const field = document.getElementById('attempts-threshold').classList;
  if (!check || type === 'section') {
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

function toggleFlagInvalid() {
  const check1 = document.getElementById('ghosts').checked;
  const check2 = document.getElementById('section').checked;
  const check3 = document.getElementById('attempts').checked;
  const field = document.getElementById('invalid').classList;
  if (check1 || check2 || check3) {
    field.remove('is-hidden');
  } else {
    field.add('is-hidden');
  }
}

toggleStudentWarn();
toggleThreshold();
toggleSectionWarn();
toggleFlagInvalid();
