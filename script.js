/* ======================
   REBA TABLE (OFFICIAL)
====================== */
const tableA = [
 [[1,2,3,4],[2,3,4,5],[3,4,5,6],[4,5,6,7],[5,6,7,8]],
 [[2,3,4,5],[3,4,5,6],[4,5,6,7],[5,6,7,8],[6,7,8,9]],
 [[3,4,5,6],[4,5,6,7],[5,6,7,8],[6,7,8,9],[7,8,9,10]]
];

const tableB = [
 [[1,2,3],[2,3,4]],
 [[2,3,4],[3,4,5]],
 [[3,4,5],[4,5,6]]
];

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

/* ======================
   CALCULATE REBA
====================== */
function calculateREBA() {
  const v = id => +document.getElementById(id).value;

  const A = tableA[v("neck")-1][v("trunk")-1][v("legs")-1] + v("load");
  const B = tableB[v("upperArm")-1][v("lowerArm")-1][v("wrist")-1] + v("coupling");

  const score = tableC[A-1][B-1] + v("activity");

  document.getElementById("score").textContent = score;

  let risk, summary;

  if (score <= 3) {
    risk = t("risk_low");
    summary = t("sum_low");
  } else if (score <= 7) {
    risk = t("risk_med");
    summary = t("sum_med");
  } else if (score <= 10) {
    risk = t("risk_high");
    summary = t("sum_high");
  } else {
    risk = t("risk_vhigh");
    summary = t("sum_vhigh");
  }

  document.getElementById("risk").textContent = risk;
  document.getElementById("summaryText").textContent = summary;
  document.getElementById("result").classList.remove("hidden");
}

function resetForm() {
  document.querySelectorAll("select,input").forEach(e => e.value = "");
  document.getElementById("result").classList.add("hidden");
}

/* ======================
   MULTI LANGUAGE
====================== */
const langData = {
 id: {
  title:"ANALISA REBA",
  subtitle:"Penilaian Postur Kerja Metode REBA",
  task:"Nama Task / Pekerjaan",
  reviewer:"Reviewer / Penilai",
  groupA:"Grup A",
  groupB:"Grup B",
  additional:"Faktor Tambahan",
  calc:"Hitung REBA",
  reset:"Reset",
  result:"Hasil Analisis",
  score:"Skor REBA",
  risk:"Tingkat Risiko",
  summary:"Summary Analisis Profesional",
  risk_low:"Risiko Rendah",
  risk_med:"Risiko Sedang",
  risk_high:"Risiko Tinggi",
  risk_vhigh:"Risiko Sangat Tinggi",
  sum_low:"Risiko rendah. Tidak diperlukan tindakan segera.",
  sum_med:"Risiko sedang. Disarankan evaluasi ergonomi.",
  sum_high:"Risiko tinggi. Perlu perbaikan postur segera.",
  sum_vhigh:"Risiko sangat tinggi. Tindakan harus segera dilakukan."
 },
 en: {
  title:"REBA ANALYSIS",
  subtitle:"Rapid Entire Body Assessment",
  calc:"Calculate REBA",
  reset:"Reset",
  risk_low:"Low Risk",
  risk_med:"Medium Risk",
  risk_high:"High Risk",
  risk_vhigh:"Very High Risk",
  sum_low:"Low risk. No immediate action required.",
  sum_med:"Medium risk. Ergonomic evaluation recommended.",
  sum_high:"High risk. Immediate ergonomic improvement required.",
  sum_vhigh:"Very high risk. Immediate corrective action required."
 },
 jp: {
  title:"REBA分析",
  subtitle:"全身作業姿勢評価（REBA）",
  calc:"REBA計算",
  reset:"リセット",
  risk_low:"低リスク",
  risk_med:"中リスク",
  risk_high:"高リスク",
  risk_vhigh:"非常に高いリスク",
  sum_low:"低リスク。直ちに対策は不要です。",
  sum_med:"中リスク。人間工学的評価を推奨します。",
  sum_high:"高リスク。早急な改善が必要です。",
  sum_vhigh:"非常に高いリスク。直ちに是正措置が必要です。"
 }
};

let currentLang = "id";
function t(key){ return langData[currentLang][key] || key; }

document.getElementById("langSelect").onchange = e => {
  currentLang = e.target.value;
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    el.textContent = t(el.dataset.i18n);
  });
};

/* Dark Mode */
document.getElementById("themeToggle").onclick = () => {
  document.body.classList.toggle("dark");
};
