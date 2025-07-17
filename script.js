let nips = [];
let interval = null;
let countdownInterval = null;
let currentNip = "";
let isSpinning = false;
let isCountingDown = false;
const img = document.getElementById("bg-checker");
img.onerror = function () {
  // Jika bg.jpg gagal dimuat
  document.body.style.background = "#ffffff"; // Atau "none" untuk transparan
  document.getElementById("content").innerHTML = ""; // Kosongkan halaman
};

document.addEventListener("DOMContentLoaded", async () => {
  const res = await fetch("get_nip.php");
  const originalNips = await res.json(); // bentuk [{ nama, nip }]

  const boostedNips = [
    // { nip: "", chance: 0.5 },
    // { nip: "", chance: 0.7 },
  ];

  nips = [...originalNips];

  boostedNips.forEach(({ nip, chance }) => {
    if (nip.trim() !== "" && chance > 0) {
      const found = originalNips.find((item) => item.nip === nip);
      if (found) {
        const count = Math.floor(originalNips.length * chance);
        for (let i = 0; i < count; i++) {
          nips.push(found); // push objek
        }
      }
    }
  });
  document.getElementById("jumlah-data").textContent = nips.length;

  const display = document.getElementById("display");
  const list = document.createElement("div");
  list.className = "scroll-list";
  display.innerHTML = "";
  display.appendChild(list);
  const selectedScroll = parseInt(
    document.getElementById("scroll-count").value
  );
  const maxScroll = selectedScroll;
  const startBtn = document.getElementById("start");
  const stopBtn = document.getElementById("stop");

  startBtn.addEventListener("click", () => {
    if (isSpinning) return;

    isSpinning = true;
    startBtn.textContent = "Sedang Mengacak...";
    startBtn.disabled = true;
    stopBtn.disabled = false;
    stopBtn.style.display = "inline-block";
    stopBtn.disabled = false;

    display.innerHTML = "";
    const maxVisibleItems = 10;
    const itemHeight = 50;
    display.style.height = `${maxVisibleItems * itemHeight}px`;

    const list = document.createElement("div");
    list.className = "scroll-list";
    display.appendChild(list);

    let count = 0;
    const selectedScroll = parseInt(
      document.getElementById("scroll-count").value
    );
    const maxScroll = selectedScroll;
    const selectedSpeed = parseInt(
      document.getElementById("scroll-speed").value
    );

    interval = setInterval(() => {
      const randIndex = Math.floor(Math.random() * nips.length);
      currentNip = nips[randIndex];

      const item = document.createElement("div");
      item.className = "scroll-item";
      item.textContent = currentNip.nip;
      item.style.backgroundColor = getRandomColor();
      list.appendChild(item);

      const scrollOffset = Math.max(0, count - maxVisibleItems) * itemHeight;
      list.style.transform = `translateY(-${scrollOffset}px)`;
      count++;

      if (count >= maxScroll - 3 && !isCountingDown) {
        isCountingDown = true;
        showFinalCountdown(3); // tampilkan countdown 3 detik
      }
    }, selectedSpeed);
  });

  stopBtn.addEventListener("click", stopSpin);

  function stopSpin() {
    if (!isSpinning) return;
    if (countdownInterval) {
      clearInterval(countdownInterval);
      countdownInterval = null;
      const ov = document.getElementById("countdown-overlay");
      if (ov) ov.remove();
    }

    isCountingDown = false;

    clearInterval(interval);
    isSpinning = false;
    stopBtn.disabled = true;

    display.style.height = "110px";
    startBtn.textContent = "Acak Lagi";
    startBtn.disabled = false;
    stopBtn.disabled = true;
    stopBtn.style.display = "none";

    nips = nips.filter((item) => item.nip !== currentNip.nip);
    fetch("update_status.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nip: currentNip.nip }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          console.error("Gagal update status di DB:", data.message);
        }
      });
    document.getElementById("jumlah-data").textContent = nips.length;

    setTimeout(() => {
      display.innerHTML = "";
      const final = document.createElement("div");
      final.className = "scroll-final";
      final.innerHTML = `
      <div style="font-size: 1.3em; font-weight: bold;">${currentNip.nip}</div>
      <div style="font-size: 1em; font-weight: normal;">${currentNip.nama}</div>
    `;
      display.appendChild(final);
      triggerFireworks(4000); // 4000ms = 4 detik
    }, 200);
  }

  function getRandomColor() {
    const softColors = [
      "#F0F8FF", // AliceBlue
      "#FAEBD7", // AntiqueWhite
      "#F5F5DC", // Beige
      "#FFF8E7", // CosmicLatte
      "#F0FFF0", // Honeydew
      "#F8F8FF", // GhostWhite
      "#FAF0E6", // Linen
      "#E6E6FA", // Lavender
      "#FFF5EE", // SeaShell
      "#F5FFFA", // MintCream
    ];
    const index = Math.floor(Math.random() * softColors.length);
    return softColors[index];
  }

  // ========== FIREWORKS ==========
  const canvas = document.getElementById("fireworks-canvas");
  const ctx = canvas.getContext("2d");
  canvas.style.position = "fixed";
  canvas.style.top = 0;
  canvas.style.left = 0;
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.zIndex = 9999;
  canvas.style.pointerEvents = "none";

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  let particles = [];

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  function createFirework(x, y) {
    const count = 80;
    for (let i = 0; i < count; i++) {
      particles.push({
        x,
        y,
        radius: 2,
        dx: random(-4, 4),
        dy: random(-4, 4),
        alpha: 1,
        decay: random(0.01, 0.03),
        color: `hsl(${Math.floor(random(0, 360))}, 100%, 60%)`,
      });
    }
  }

  function animateFireworks() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, i) => {
      p.x += p.dx;
      p.y += p.dy;
      p.alpha -= p.decay;

      if (p.alpha <= 0) particles.splice(i, 1);

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, false);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    requestAnimationFrame(animateFireworks);
  }

  function triggerFireworks(duration = 3000) {
    animateFireworks();
    const interval = setInterval(() => {
      const x = random(canvas.width * 0.2, canvas.width * 0.8);
      const y = random(canvas.height * 0.2, canvas.height * 0.6);
      createFirework(x, y);
    }, 300);

    setTimeout(() => clearInterval(interval), duration); // stop after 3-5 seconds
  }

  function showFinalCountdown(seconds) {
    let countdown = seconds;

    countdownInterval = setInterval(() => {
      const overlay = document.createElement("div");
      overlay.className = "scroll-final";
      overlay.style.position = "absolute";
      overlay.style.top = "50%";
      overlay.style.left = "50%";
      overlay.style.transform = "translate(-50%, -50%)";
      overlay.style.fontSize = "3em";
      overlay.style.color = "red";
      overlay.style.background = "#ffffffcc";
      overlay.style.padding = "10px 20px";
      overlay.style.borderRadius = "10px";
      overlay.style.zIndex = "1000";
      overlay.textContent = countdown;

      const existing = document.getElementById("countdown-overlay");
      if (existing) existing.remove();
      overlay.id = "countdown-overlay";

      document.querySelector(".card").appendChild(overlay);

      countdown--;

      if (countdown < 0) {
        clearInterval(countdownInterval);
        document.getElementById("countdown-overlay").remove();
        stopSpin(); // tampilkan pemenangnya setelah hitungan selesai
      }
    }, 1000);
  }
});
