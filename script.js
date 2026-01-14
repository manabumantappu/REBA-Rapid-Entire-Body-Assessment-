function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function calculateREBA() {
  const v = id => +document.getElementById(id).value;

  let neckScore = adjustNeck(v("neck"));
  let trunkScore = adjustTrunk(v("trunk"));
  let legsScore = v("legs");

  let upperArmScore = adjustUpperArm(v("upperArm"));
  let lowerArmScore = v("lowerArm");
  let wristScore = adjustWrist(v("wrist"));

  const load = v("load");
  const coupling = v("coupling");
  const activity = v("activity");

  // CLAMP sesuai tabel REBA
  neckScore = clamp(neckScore, 1, 3);
  trunkScore = clamp(trunkScore, 1, 5);
  legsScore = clamp(legsScore, 1, 4);

  upperArmScore = clamp(upperArmScore, 1, 3);
  lowerArmScore = clamp(lowerArmScore, 1, 2);
  wristScore = clamp(wristScore, 1, 3);

  const scoreA =
    tableA[neckScore - 1][trunkScore - 1][legsScore - 1] + load;

  const scoreB =
    tableB[upperArmScore - 1][lowerArmScore - 1][wristScore - 1] + coupling;

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
  document.querySelectorAll("select").forEach(s=>s.selectedIndex=0);
  document.getElementById("result").classList.add("hidden");
}
document.getElementById("reportDate").textContent =
  new Date().toLocaleDateString();
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
