<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <title>Undian NIP</title>
  <link rel="stylesheet" href="style.css" />
</head>

<body>
  <img id="bg-checker" src="bg.jpg" alt="check" />

  <div class="container">
    <div class="card">
      <h1>🎉 Undian Jalan Santai 🎉</h1>
      <div id="display">Klik "Acak" untuk mulai</div>

      <button id="start">Acak</button>
      <button id="stop" disabled>stop</button>
      <br />
      <div style="padding-top: 10px">
        <label for="scroll-count">Total Peserta : <span id="jumlah-data">0</span> </label>,
        <label for="scroll-count">Jumlah Acak:</label>
        <select id="scroll-count">
          <option value="10">10x</option>
          <option value="20">20x</option>
          <option value="50" selected>50x</option>
          <option value="100">100x</option>
          <option value="200">200x</option>
          <option value="500">500x</option>
          <option value="1000">1000x</option>
        </select>
      </div>
      <div style="padding-top: 10px">
        <label for="scroll-speed">Kecepatan Acak:</label>
        <select id="scroll-speed">
          <option value="20">Sangat Cepat</option>
          <option value="50" selected>Normal</option>
          <option value="100">Lambat</option>
          <option value="200">Sangat Lambat</option>
        </select>
      </div>
    </div>
  </div>
  <script src="script.js"></script>
  <canvas id="fireworks-canvas"></canvas>

</body>

</html>