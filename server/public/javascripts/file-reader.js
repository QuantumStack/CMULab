const file = document.getElementById('file');
file.onchange = () => {
  if (file.files.length > 0) {
    document.getElementById('filename').innerHTML = file.files[0].name;

    const reader = new FileReader();
    reader.onload = (() => (e) => {
      document.getElementById('csv').value = e.target.result.trim();
    })(file.files[0]);

    reader.readAsText(file.files[0]);
  }
};
