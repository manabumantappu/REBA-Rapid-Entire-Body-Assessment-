/* =========================================================
   REBA OFFICIAL TABLES (ISO - SIMPLIFIED LEG SCORE)
========================================================= */

// TABLE A: Neck (1–3) × Trunk (1–5) × Legs (1–2 simplified)
const tableA = [
  [[1,2,3,4],[2,3,4,5],[3,4,5,6],[4,5,6,7],[5,6,7,8]],
  [[2,3,4,5],[3,4,5,6],[4,5,6,7],[5,6,7,8],[6,7,8,9]],
  [[3,4,5,6],[4,5,6,7],[5,6,7,8],[6,7,8,9],[7,8,9,10]]
];

// TABLE B
const tableB = [
  [[1,2,3],[2,3,4]],
  [[2,3,4],[3,4,5]],
  [[3,4,5],[4,5,6]]
];

// TABLE C
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
const clamp = (v,min,max)=>Math.max(min,Math.min(max,v));
let historyData = JSON.parse(localStorage.getItem("rebaHistory")) || [];

/* =========================
   THEME
========================= */
const themeBtn = document.getElementById("themeToggle");
themeBtn.onclick = () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark"));
};
if (localStorage.getItem("theme")==="true") document.body.classList.add("dark");

/* =========================
   CALCULATE REBA
========================= */
function calculateREBA() {
  const v = id => Number(document.getElementById(id)?.value);

  let neck=v("neck"), trunk=v("trunk"), legs=v("legs"),
      upper=v("upperArm"), lower=v("lowerArm"), wrist=v("wrist");

  if (![neck,trunk,legs,upper,lower,wrist].every(n=>n>=1)) {
    alert("⚠️ Lengkapi semua penilaian postur terlebih dahulu.");
    return;
  }

  neck = adjustNeck(neck);
  trunk = adjustTrunk(trunk);
  upper = adjustUpperArm(upper);
  wrist = adjustWrist(wrist);

  neck=clamp(neck,1,3);
  trunk=clamp(trunk,1,5);
  legs=clamp(legs,1,2);
  upper=clamp(upper,1,3);
  lower=clamp(lower,1,2);
  wrist=clamp(wrist,1,3);

  const load=v("load")||0, coupling=v("coupling")||0, activity=v("activity")||0;

  const scoreA = tableA[neck-1][trunk-1][legs-1] + load;
  const scoreB = tableB[upper-1][lower-1][wrist-1] + coupling;
  const finalScore = tableC[clamp(scoreA,1,8)-1][clamp(scoreB,1,7)-1] + activity;

  const level =
    finalScore<=1?["Sangat Rendah","Tidak diperlukan tindakan."]:
    finalScore<=3?["Rendah","Mungkin perlu perbaikan."]:
    finalScore<=7?["Sedang","Perlu investigasi dan perubahan."]:
    finalScore<=10?["Tinggi","Perlu tindakan segera."]:
    ["Sangat Tinggi","Tindakan harus dilakukan SEKARANG."];

  score.textContent = finalScore;
  risk.textContent = level[0];
  recommendation.textContent = level[1];
  result.classList.remove("hidden");

  document.getElementById("reportTask").textContent =
    document.getElementById("taskName").value || "-";
  document.getElementById("reportReviewer").textContent =
    document.getElementById("reviewer").value || "-";

  saveHistory(finalScore, level[0]);
}

/* =========================
   HISTORY
========================= */
function saveHistory(score, risk) {
  historyData.unshift({
    date:new Date().toLocaleString(),
    task:taskName.value||"-",
    reviewer:reviewer.value||"-",
    score,risk
  });
  localStorage.setItem("rebaHistory",JSON.stringify(historyData));
  renderHistory();
}

function renderHistory() {
  history.innerHTML="";
  historyData.forEach(h=>{
    const li=document.createElement("li");
    li.textContent=`${h.date} | ${h.task} | ${h.reviewer} | Skor ${h.score} | ${h.risk}`;
    history.appendChild(li);
  });
}
renderHistory();

/* =========================
   EXPORT CSV
========================= */
function exportCSV() {
  let csv="Tanggal,Tugas,Reviewer,Skor,Risiko\n";
  historyData.forEach(h=>{
    csv+=`${h.date},${h.task},${h.reviewer},${h.score},${h.risk}\n`;
  });
  const a=document.createElement("a");
  a.href=URL.createObjectURL(new Blob([csv]));
  a.download="reba_iso_report.csv";
  a.click();
}

/* =========================
   RESET
========================= */
function resetForm() {
  document.querySelectorAll("select").forEach(s=>s.selectedIndex=0);
  document.querySelectorAll("input").forEach(i=>{
    if(i.type==="checkbox") i.checked=false;
    if(i.type==="number"||i.type==="text") i.value="";
  });
  result.classList.add("hidden");
}

/* =========================
   ADJUST
========================= */
const isChecked=id=>document.getElementById(id)?.checked;
const adjustNeck=s=>(isChecked("neckTwist")?s+1:s)+(isChecked("neckSide")?1:0);
const adjustTrunk=s=>(isChecked("trunkTwist")?s+1:s)+(isChecked("trunkSide")?1:0);
const adjustUpperArm=s=>{
  if(isChecked("shoulderRaised")) s++;
  if(isChecked("upperAbducted")) s++;
  if(isChecked("armSupported")) s--;
  return s<1?1:s;
};
const adjustWrist=s=>isChecked("wristTwist")?s+1:s;

/* =========================
   DATE
========================= */
reportDate.textContent=new Date().toLocaleDateString();
