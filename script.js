/* ========================
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

  let neckScore = v("neck");
  let trunkScore = v("trunk");
  let legsScore = v("legs");

  let upperArmScore = v("upperArm");
  let lowerArmScore = v("lowerArm");
  let wristScore = v("wrist");

  neckScore = adjustNeck(neckScore);
  trunkScore = adjustTrunk(trunkScore);
  upperArmScore = adjustUpperArm(upperArmScore);
  wristScore = adjustWrist(wristScore);

  neckScore = clamp(neckScore, 1, 3);
  trunkScore = clamp(trunkScore, 1, 5);
  legsScore = clamp(legsScore, 1, 4);
  upperArmScore = clamp(upperArmScore, 1, 3);
  lowerArmScore = clamp(lowerArmScore, 1, 2);
  wristScore = clamp(wristScore, 1, 3);

   // === TAMPILKAN SEMUA SKOR PER BAGIAN ===

// Grup A
document.getElementById("neckScoreText").textContent = neckScore;
document.getElementById("trunkScoreText").textContent = trunkScore;
document.getElementById("legsScoreText").textContent = legsScore;

// Grup B
document.getElementById("upperArmScoreText").textContent = upperArmScore;
document.getElementById("lowerArmScoreText").textContent = lowerArmScore;
document.getElementById("wristScoreText").textContent = wristScore;

  const load = v("load");
  const coupling = v("coupling");
  const activity = v("activity");

  const scoreA =
    tableA[neckScore - 1][trunkScore - 1][legsScore - 1] + load;

  const scoreB =
    tableB[upperArmScore - 1][lowerArmScore - 1][wristScore - 1] + coupling;

   highlightScoreA(neckScore, trunkScore, legsScore);
   highlightScoreB(upperArmScore, lowerArmScore, wristScore);

   const summaryData = [];

// Grup A
if (neckScore >= 3)
  summaryData.push({ label: "Leher", score: neckScore, reasons: ["Neck posture"] });

if (trunkScore >= 3)
  summaryData.push({
    label: "Punggung",
    score: trunkScore,
    reasons: [
      isChecked("trunkTwist") ? "Trunk twisted" : null,
      isChecked("trunkSide") ? "Trunk side bending" : null
    ].filter(Boolean)
  });

if (legsScore >= 3)
  summaryData.push({ label: "Kaki", score: legsScore, reasons: [] });

// Grup B
if (upperArmScore >= 3)
  summaryData.push({
    label: "Lengan Atas",
    score: upperArmScore,
    reasons: [
      isChecked("shoulderRaised") ? "Shoulder raised" : null,
      isChecked("upperAbducted") ? "Upper arm abducted" : null
    ].filter(Boolean)
  });

if (wristScore >= 3)
  summaryData.push({
    label: "Pergelangan",
    score: wristScore,
    reasons: isChecked("wristTwist") ? ["Wrist bent / twisted"] : []
  });

// TAMPILKAN
document.getElementById("autoSummary").textContent =
  "Ringkasan Risiko: " + generateSummary(summaryData);

const taskName = document.getElementById("taskName").value || "-";
const reviewer = document.getElementById("reviewer").value || "-";
const safeA = clamp(scoreA, 1, tableC.length);
const safeB = clamp(scoreB, 1, tableC[0].length);

const finalScore =
  tableC[safeA - 1][safeB - 1] + activity;

document.getElementById("resultTask").textContent = taskName;
document.getElementById("resultReviewer").textContent = reviewer;

   // 👉 TAMPILKAN SCORE A & B
   document.getElementById("scoreA").textContent = scoreA;
   document.getElementById("scoreB").textContent = scoreB;
   
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
function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

// =========================
// HISTORY
// =========================
function saveHistory(score, risk) {
  historyData.unshift({
    date: new Date().toLocaleString(),
    task: document.getElementById("taskName").value || "-",
    reviewer: document.getElementById("reviewer").value || "-",
    score,
    risk
  });
  localStorage.setItem("rebaHistory", JSON.stringify(historyData));
  renderHistory();
}

function renderHistory() {
  const ul = document.getElementById("history");
  ul.innerHTML = "";
  historyData.forEach(h => {
    const li = document.createElement("li");
   li.textContent = `${h.date} | ${h.task} | Skor ${h.score} | ${h.risk} | Reviewer: ${h.reviewer}`;
   ul.appendChild(li);
  });
}
renderHistory();

// =========================
function exportCSV() {
 let csv = "Tanggal,Task,Reviewer,Skor,Risiko\n";
historyData.forEach(h=>{
  csv += `${h.date},${h.task},${h.reviewer},${h.score},${h.risk}\n`;
});

  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv]));
  a.download = "reba_valid.csv";
  a.click();
}
/* =========================
   PHOTO + MARKING SYSTEM
========================= */
const photoInput = document.getElementById("photoInput");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let img = new Image();
let points = [];

photoInput.onchange = e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      points = [];
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
};

canvas.addEventListener("click", e => {
  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left) * (canvas.width / rect.width);
  const y = (e.clientY - rect.top) * (canvas.height / rect.height);

  points.push({ x, y });

  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(x, y, 5, 0, Math.PI * 2);
  ctx.fill();
});


function resetForm() {
  document.querySelectorAll("select").forEach(s => s.selectedIndex = 0);
  document.querySelectorAll("input[type=number], input[type=text]").forEach(i => i.value = "");
  document.querySelectorAll("input[type=checkbox]").forEach(c => c.checked = false);
  document.getElementById("result").classList.add("hidden");
  clearHighlight();
  clearHighlightB();
}


/* ===============================
   ANGLE → SCORE MAPPING (REBA)
================================ */

// NECK
function mapNeck(angle) {
  if (angle === null || angle === "") return null;
  angle = Math.abs(angle);

  if (angle <= 20) return 1;
  if (angle <= 45) return 2;
  return 3;
}

// TRUNK
function mapTrunk(angle) {
  if (angle === null || angle === "") return null;
  angle = Math.abs(angle);

  if (angle <= 5) return 1;
  if (angle <= 20) return 2;
  if (angle <= 60) return 3;
  return 4;
}

// UPPER ARM
function mapUpperArm(angle) {
  if (angle === null || angle === "") return null;
  angle = Math.abs(angle);

  if (angle <= 20) return 1;
  if (angle <= 45) return 2;
  if (angle <= 90) return 3;
  return 4;
}

// LOWER ARM
function mapLowerArm(angle) {
  if (angle === null || angle === "") return null;
  angle = Math.abs(angle);

  if (angle >= 60 && angle <= 100) return 1;
  return 2;
}

// WRIST
function mapWrist(angle) {
  if (angle === null || angle === "") return null;
  angle = Math.abs(angle);

  if (angle <= 15) return 1;
  return 2;
}
function syncAngleToSelect(angleId, selectId, mapper) {
  const angleInput = document.getElementById(angleId);
  const select = document.getElementById(selectId);

  if (!angleInput || !select) return;

  angleInput.addEventListener("input", () => {
    const score = mapper(angleInput.value);
    if (score !== null) {
      select.value = score;
    }
  });
}

// HUBUNGKAN
syncAngleToSelect("neckAngle", "neck", mapNeck);
syncAngleToSelect("trunkAngle", "trunk", mapTrunk);
syncAngleToSelect("upperArmAngle", "upperArm", mapUpperArm);
syncAngleToSelect("lowerArmAngle", "lowerArm", mapLowerArm);
syncAngleToSelect("wristAngle", "wrist", mapWrist);

function isChecked(id) {
  const el = document.getElementById(id);
  return el && el.checked;
}

function adjustNeck(score) {
  if (isChecked("neckTwist")) score += 1;
  if (isChecked("neckSide")) score += 1;
  return score;
}

function adjustTrunk(score) {
  if (isChecked("trunkTwist")) score += 1;
  if (isChecked("trunkSide")) score += 1;
  return score;
}

function adjustUpperArm(score) {
  if (isChecked("shoulderRaised")) score += 1;
  if (isChecked("upperAbducted")) score += 1;
  if (isChecked("armSupported")) score -= 1;
  return score < 1 ? 1 : score;
}

function adjustWrist(score) {
  if (isChecked("wristTwist")) score += 1;
  return score;
}
// =========================
// HIGHLIGHT SCORE A
// =========================
function clearHighlight() {
  ["neckBlock", "trunkBlock", "legsBlock"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove("highlight-danger", "highlight-warning");
  });
}

function highlightScoreA(neckScore, trunkScore, legsScore) {
  clearHighlight();

  const trunkReasons = [];
  const neckReasons = [];
  const legsReasons = [];

  if (isChecked("trunkTwist")) trunkReasons.push("Trunk twisted");
  if (isChecked("trunkSide")) trunkReasons.push("Trunk side bending");

  if (isChecked("neckTwist")) neckReasons.push("Neck twisted");
  if (isChecked("neckSide")) neckReasons.push("Neck side bending");

  const scores = [
    { id: "neckBlock", value: neckScore, reasons: neckReasons },
    { id: "trunkBlock", value: trunkScore, reasons: trunkReasons },
    { id: "legsBlock", value: legsScore, reasons: [] }
  ];

  const max = Math.max(neckScore, trunkScore, legsScore);

  scores.forEach(s => {
    const el = document.getElementById(s.id);
    if (!el) return;

    if (s.value === max && max >= 3) {
      el.classList.add("highlight-danger");
      setTooltip(s.id, s.reasons);
    } else if (s.value === max && max === 2) {
      el.classList.add("highlight-warning");
      setTooltip(s.id, s.reasons);
    } else {
      setTooltip(s.id, []);
    }
  });
}

// =========================
// HIGHLIGHT SCORE B
// =========================
function highlightScoreB(upper, lower, wrist) {
  clearHighlightB();

  const upperReasons = [];
  const wristReasons = [];

  if (isChecked("shoulderRaised")) upperReasons.push("Shoulder raised");
  if (isChecked("upperAbducted")) upperReasons.push("Upper arm abducted");
  if (isChecked("armSupported")) upperReasons.push("Arm not supported");

  if (isChecked("wristTwist")) wristReasons.push("Wrist bent / twisted");

  const scores = [
    { id: "upperarmBlock", value: upper, reasons: upperReasons },
    { id: "lowerarmBlock", value: lower, reasons: [] },
    { id: "wristBlock", value: wrist, reasons: wristReasons }
  ];

  const max = Math.max(upper, lower, wrist);

  scores.forEach(s => {
    const el = document.getElementById(s.id);
    if (!el) return;

    if (s.value === max && max >= 3) {
      el.classList.add("highlight-danger");
      setTooltip(s.id, s.reasons);
    } 
    else if (s.value === max && max === 2) {
      el.classList.add("highlight-warning");
      setTooltip(s.id, s.reasons);
    } 
    else {
      setTooltip(s.id, []);
    }
  });
}

function setTooltip(id, messages) {
  const el = document.getElementById(id);
  if (!el) return;

  if (messages.length === 0) {
    el.removeAttribute("data-tooltip");
  } else {
    el.setAttribute(
      "data-tooltip",
      "Skor tinggi karena:\n- " + messages.join("\n- ")
    );
  }
}

function generateSummary(data) {
  if (data.length === 0) {
    return "Risiko rendah, tidak ada bagian tubuh dominan yang berbahaya.";
  }

  const parts = data.map(d => `${d.label} (Skor ${d.score})`).join(" dan ");
  const reasons = data
    .flatMap(d => d.reasons)
    .filter((v, i, a) => a.indexOf(v) === i);

  let text = `Risiko utama disebabkan oleh ${parts}.`;

  if (reasons.length > 0) {
    text += ` Faktor penyebab: ${reasons.join(", ")}.`;
  }

  return text;
}
