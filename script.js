function calculateREBA() {
  const neck = +document.getElementById("neck").value;
  const trunk = +document.getElementById("trunk").value;
  const legs = +document.getElementById("legs").value;

  const upperArm = +document.getElementById("upperArm").value;
  const lowerArm = +document.getElementById("lowerArm").value;
  const wrist = +document.getElementById("wrist").value;

  const load = +document.getElementById("load").value;
  const activity = +document.getElementById("activity").value;

  // Simplified REBA logic (educational)
  const scoreA = neck + trunk + legs + load;
  const scoreB = upperArm + lowerArm + wrist;
  const total = scoreA + scoreB + activity;

  let risk = "";
  let recommendation = "";

  if (total <= 3) {
    risk = "Sangat Rendah";
    recommendation = "Postur dapat diterima.";
  } else if (total <= 7) {
    risk = "Sedang";
    recommendation = "Perlu evaluasi dan perbaikan.";
  } else if (total <= 10) {
    risk = "Tinggi";
    recommendation = "Perlu perbaikan segera.";
  } else {
    risk = "Sangat Tinggi";
    recommendation = "Tindakan ergonomi harus dilakukan sekarang.";
  }

  document.getElementById("score").textContent = total;
  document.getElementById("risk").textContent = risk;
  document.getElementById("recommendation").textContent = recommendation;

  document.getElementById("result").classList.remove("hidden");
}

function resetForm() {
  document.querySelectorAll("select").forEach(s => s.selectedIndex = 0);
  document.getElementById("result").classList.add("hidden");
}
let historyData = JSON.parse(localStorage.getItem("rebaHistory")) || [];

// THEME
const toggle = document.getElementById("themeToggle");
toggle.onclick = () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark"));
};

if (localStorage.getItem("theme") === "true") {
  document.body.classList.add("dark");
}

// HITUNG REBA
function calculateREBA() {
  const get = id => +document.getElementById(id).value;

  const scoreA = get("neck") + get("trunk") + get("legs") + get("load");
  const scoreB = get("upperArm") + get("lowerArm") + get("wrist");
  const total = scoreA + scoreB + get("activity");

  let risk, rec;
  if (total <= 3) {
    risk = "Sangat Rendah"; rec = "Postur dapat diterima.";
  } else if (total <= 7) {
    risk = "Sedang"; rec = "Perlu evaluasi.";
  } else if (total <= 10) {
    risk = "Tinggi"; rec = "Perbaikan segera.";
  } else {
    risk = "Sangat Tinggi"; rec = "Tindakan ergonomi sekarang.";
  }

  document.getElementById("score").textContent = total;
  document.getElementById("risk").textContent = risk;
  document.getElementById("recommendation").textContent = rec;
  document.getElementById("result").classList.remove("hidden");

  saveHistory(total, risk);
}

// SIMPAN RIWAYAT
function saveHistory(score, risk) {
  const item = {
    date: new Date().toLocaleString(),
    score,
    risk
  };
  historyData.unshift(item);
  localStorage.setItem("rebaHistory", JSON.stringify(historyData));
  renderHistory();
}

// TAMPIL RIWAYAT
function renderHistory() {
  const ul = document.getElementById("history");
  ul.innerHTML = "";
  historyData.forEach(h => {
    const li = document.createElement("li");
    li.textContent = `${h.date} | Skor: ${h.score} | ${h.risk}`;
    ul.appendChild(li);
  });
}
renderHistory();

// EXPORT CSV
function exportCSV() {
  let csv = "Tanggal,Skor,Risiko\n";
  historyData.forEach(h => {
    csv += `${h.date},${h.score},${h.risk}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "reba_history.csv";
  a.click();
}

// RESET
function resetForm() {
  document.querySelectorAll("select").forEach(s => s.selectedIndex = 0);
  document.getElementById("result").classList.add("hidden");
}
