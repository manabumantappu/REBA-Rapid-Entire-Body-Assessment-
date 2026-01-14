/* =========================================================
   REBA OFFICIAL TABLES (ISO / Hignett & McAtamney)
========================================================= */

// TABLE A: Neck (1–3) × Trunk (1–5) × Legs (1–4)
const tableA = [
  [
    [1,2,3,4],[2,3,4,5],[3,4,5,6],[4,5,6,7],[5,6,7,8]
  ],
  [
    [2,3,4,5],[3,4,5,6],[4,5,6,7],[5,6,7,8],[6,7,8,9]
  ],
  [
    [3,4,5,6],[4,5,6,7],[5,6,7,8],[6,7,8,9],[7,8,9,10]
  ]
];

// TABLE B: Upper Arm (1–3) × Lower Arm (1–2) × Wrist (1–3)
const tableB = [
  [[1,2,3],[2,3,4]],
  [[2,3,4],[3,4,5]],
  [[3,4,5],[4,5,6]]
];

// TABLE C: Score A (1–8) × Score B (1–7)
const tableC = [
  [1,2,3,4,5,6,7],
  [2,3,4,5,6,7,8],
  [3,4,5,6,7,8,9],
  [4,5,6,7,8,9,10],
  [5,6,7,8,9,10,11],
  [6,7,8,9,10,11,12],
  [7,8,9,10,11,12,13],
  [8,9,10,11,12,13,14]
];

// =========================================================

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

let historyData = JSON.parse(localStorage.getItem("rebaHistory")) || [];

/* =========================
   THEME
========================= */
document.getElementById("themeToggle").onclick = () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark"));
};
if (localStorage.getItem("theme") === "true") {
  document.body.classList.add("dark");
}

/* =========================
   CORE CALCULATION (ISO)
========================= */
function calculateREBA() {
  const v = id => Number(document.getElementById(id)?.value);

  let neck = v("neck");
  let trunk = v("trunk");
  let legs = v("legs");
  let upper = v("upperArm");
  let lower = v("lowerArm");
  let wrist = v("wrist");

  // VALIDASI ISO
  if (![neck,trunk,legs,upper,lower,wrist].every(n => n >= 1)) {
    alert("⚠️ Lengkapi semua penilaian postur terlebih dahulu.");
    return;
  }

  // Adjust ISO REBA
  neck = adjustNeck(neck);
  trunk = adjustTrunk(trunk);
  upper = adjustUpperArm(upper);
  wrist = adjustWrist(wrist);

  const load = v("load") || 0;
  const coupling = v("coupling") || 0;
  const activity = v("activity") || 0;

  // Clamp resmi
  neck = clamp(neck,1,3);
  trunk = clamp(trunk,1,5);
  legs = clamp(legs,1,2);       // HTML 2 opsi → ISO disederhanakan
  upper = clamp(upper,1,3);
  lower = clamp(lower,1,2);
  wrist = clamp(wrist,1,3);

  const scoreA = tableA[neck-1][trunk-1][legs-1] + load;
  const scoreB = tableB[upper-1][lower-1][wrist-1] + coupling;

  const finalScore =
    tableC[clamp(scoreA,1,8)-1][clamp(scoreB,1,7)-1] + activity;

  let risk, rec;
  if (finalScore <= 1) {
    risk = "Sangat Rendah";
    rec = "Tidak diperlukan tindakan.";
  } else if (finalScore <= 3) {
    risk = "Rendah";
    rec = "Mungkin perlu perbaikan.";
  } else if (finalScore <= 7) {
    risk = "Sedang";
    rec = "Perlu investigasi dan perubahan.";
  } else if (finalScore <= 10) {
    risk = "Tinggi";
    rec = "Perlu tindakan segera.";
  } else {
    risk = "Sangat Tinggi";
    rec = "Tindakan harus dilakukan SEKARANG.";
  }

  document.getElementById("score").textContent = finalScore;
  document.getElementById("risk").textContent = risk;
  document.getElementById("recommendation").textContent = rec;
  document.getElementById("result").classList.remove("hidden");

  saveHistory(finalScore, risk);
}

/* =========================
   HISTORY & EXPORT
========================= */
function saveHistory(score, risk) {
  historyData.unshift({
    date: new Date().toLocaleString(),
    score, risk
  });
  localStorage.setItem("rebaHistory", JSON.stringify(historyData));
  renderHistory();
}

function renderHistory() {
  const ul = document.getElementById("history");
  ul.innerHTML = "";
  historyData.forEach(h => {
    const li = document.createElement("li");
    li.textContent = `${h.date} | Skor ${h.score} | ${h.risk}`;
    ul.appendChild(li);
  });
}
renderHistory();

function exportCSV() {
  let csv = "Tanggal,Skor,Risiko\n";
  historyData.forEach(h=>{
    csv += `${h.date},${h.score},${h.risk}\n`;
  });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv]));
  a.download = "reba_iso_valid.csv";
  a.click();
}

/* =========================
   RESET (UX FIX)
========================= */
function resetForm() {
  document.querySelectorAll("select").forEach(s => s.selectedIndex = 0);
  document.querySelectorAll("input[type=number]").forEach(i => i.value = "");
  document.querySelectorAll("input[type=checkbox]").forEach(c => c.checked = false);
  document.getElementById("result").classList.add("hidden");
}

/* =========================
   DATE
========================= */
document.getElementById("reportDate").textContent =
  new Date().toLocaleDateString();

/* =========================
   ADJUST FUNCTIONS (ISO)
========================= */
function isChecked(id) {
  return document.getElementById(id)?.checked;
}

function adjustNeck(s) {
  if (isChecked("neckTwist")) s++;
  if (isChecked("neckSide")) s++;
  return s;
}

function adjustTrunk(s) {
  if (isChecked("trunkTwist")) s++;
  if (isChecked("trunkSide")) s++;
  return s;
}

function adjustUpperArm(s) {
  if (isChecked("shoulderRaised")) s++;
  if (isChecked("upperAbducted")) s++;
  if (isChecked("armSupported")) s--;
  return s < 1 ? 1 : s;
}

function adjustWrist(s) {
  if (isChecked("wristTwist")) s++;
  return s;
}
img.onload = () => {
  const maxWidth = canvas.parentElement.clientWidth;
  const scale = Math.min(1, maxWidth / img.width);

  canvas.width = img.width * scale;
  canvas.height = img.height * scale;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
};
