/* =========================
   REBA TABLE (OFFICIAL)
========================= */

// TABLE A: Neck + Trunk + Legs
const tableA = [
/* Neck 1 */ [
  [1,2,3,4], // Trunk 1 (legs 1-4)
  [2,3,4,5], // Trunk 2
  [3,4,5,6], // Trunk 3
  [4,5,6,7], // Trunk 4
  [5,6,7,8]  // Trunk 5
],
/* Neck 2 */ [
  [2,3,4,5],
  [3,4,5,6],
  [4,5,6,7],
  [5,6,7,8],
  [6,7,8,9]
],
/* Neck 3 */ [
  [3,4,5,6],
  [4,5,6,7],
  [5,6,7,8],
  [6,7,8,9],
  [7,8,9,10]
]
];

// TABLE B: UpperArm + LowerArm + Wrist
const tableB = [
/* Upper 1 */ [
  [1,2,3], // Lower 1
  [2,3,4]  // Lower 2
],
/* Upper 2 */ [
  [2,3,4],
  [3,4,5]
],
/* Upper 3 */ [
  [3,4,5],
  [4,5,6]
]
];

// FINAL TABLE C
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

// =========================

let historyData = JSON.parse(localStorage.getItem("rebaHistory")) || [];

// THEME
document.getElementById("themeToggle").onclick = () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark"));
};
if (localStorage.getItem("theme") === "true") {
  document.body.classList.add("dark");
}

// =========================
// CALCULATE REBA (REAL)
// =========================
function calculateREBA() {
  const v = id => +document.getElementById(id).value;

  const neck = v("neck") - 1;
  const trunk = v("trunk") - 1;
  const legs = v("legs") - 1;

  const upper = v("upperArm") - 1;
  const lower = v("lowerArm") - 1;
  const wrist = v("wrist") - 1;

  const load = v("load");
  const coupling = v("coupling");
  const activity = v("activity");

  const scoreA = tableA[neck][trunk][legs] + load;
  const scoreB = tableB[upper][lower][wrist] + coupling;

  const finalScore = tableC[scoreA-1][scoreB-1] + activity;

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

// =========================
// HISTORY
// =========================
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

// =========================
function exportCSV() {
  let csv = "Tanggal,Skor,Risiko\n";
  historyData.forEach(h=>{
    csv += `${h.date},${h.score},${h.risk}\n`;
  });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv]));
  a.download = "reba_valid.csv";
  a.click();
}

function resetForm() {
  document.querySelectorAll("select").forEach(s=>s.selectedIndex=0);
  document.getElementById("result").classList.add("hidden");
}
