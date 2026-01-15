/* =========================
   TABEL REBA RESMI
========================= */

// TABLE A (Neck + Trunk + Legs)
const tableA = [
  [[1,2,3,4],[2,3,4,5],[3,4,5,6],[4,5,6,7],[5,6,7,8]],
  [[2,3,4,5],[3,4,5,6],[4,5,6,7],[5,6,7,8],[6,7,8,9]],
  [[3,4,5,6],[4,5,6,7],[5,6,7,8],[6,7,8,9],[7,8,9,10]]
];

// TABLE B (Upper + Lower + Wrist)
const tableB = [
  [[1,2,3],[2,3,4]],
  [[2,3,4],[3,4,5]],
  [[3,4,5],[4,5,6]]
];

// TABLE C (Final)
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

/* =========================
   HITUNG REBA
========================= */
function calculateREBA() {
  const v = id => +document.getElementById(id).value;

  const neck = v("neck");
  const trunk = v("trunk");
  const legs = v("legs");

  const upper = v("upperArm");
  const lower = v("lowerArm");
  const wrist = v("wrist");

  const load = v("load");
  const coupling = v("coupling");
  const activity = v("activity");

  const scoreA = tableA[neck-1][trunk-1][legs-1] + load;
  const scoreB = tableB[upper-1][lower-1][wrist-1] + coupling;

  const finalScore = tableC[scoreA-1][scoreB-1] + activity;

  // Interpretasi risiko
  let risk, rec;
  if (finalScore <= 1) {
    risk = "Sangat Rendah";
    rec = "Tidak diperlukan tindakan.";
  } else if (finalScore <= 3) {
    risk = "Rendah";
    rec = "Perbaikan mungkin diperlukan.";
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

  // Tampilkan hasil
  document.getElementById("rTask").textContent = taskName.value || "-";
  document.getElementById("rReviewer").textContent = reviewer.value || "-";
  document.getElementById("scoreA").textContent = scoreA;
  document.getElementById("scoreB").textContent = scoreB;
  document.getElementById("finalScore").textContent = finalScore;
  document.getElementById("risk").textContent = risk;
  document.getElementById("recommendation").textContent = rec;
  document.getElementById("result").classList.remove("hidden");

  // Simpan ke localStorage
  localStorage.setItem("lastREBA", JSON.stringify({
    task: taskName.value,
    reviewer: reviewer.value,
    finalScore,
    risk
  }));
}

/* ========================= */
function resetForm() {
  document.querySelectorAll("select, input").forEach(e => e.value = "");
  document.getElementById("result").classList.add("hidden");
}

/* =========================
   EXPORT CSV
========================= */
function exportCSV() {
  const data = JSON.parse(localStorage.getItem("lastREBA"));
  if (!data) return alert("Belum ada data");

  let csv = "Task,Reviewer,Score,Risk\n";
  csv += `${data.task},${data.reviewer},${data.finalScore},${data.risk}`;

  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv]));
  a.download = "reba_result.csv";
  a.click();
}

/* =========================
   DARK MODE
========================= */
themeToggle.onclick = () => {
  document.body.classList.toggle("dark");
};
