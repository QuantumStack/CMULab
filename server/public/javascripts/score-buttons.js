function resetScore() {
  const btns = document.getElementsByClassName('score-button');
  for (let i = 0; i < btns.length; i += 1) {
    btns[i].classList.remove('is-dark');
  }
}

function setScore(n) {
  resetScore();
  document.getElementById(`score-${n}`).classList.add('is-dark');
  document.getElementById('score').value = n;
}
