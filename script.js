function v(id){
  return parseInt(document.getElementById(id)?.value) || 0;
}

function calculateREBA(){

  // === INPUT ===
  const neck  = v("neck");
  const trunk = v("trunk");
  const legs  = v("legs");
  const load  = v("load");

  const upper = v("upperArm");
  const lower = v("lowerArm");
  const wrist = v("wrist");
  const coupling = v("coupling");

  const activity = v("activity");

  // === TABLE A & B ===
  const postureA = tableA(neck, trunk, legs) + load;
  const postureB = tableB(upper, lower, wrist) + coupling;

  // === TABLE C ===
  const reba = tableC(postureA, postureB) + activity;

  // === OUTPUT ===
  set("scoreA", postureA);
  set("scoreB", postureB);
  set("score", reba);

  set("resultTask", taskName.value || "-");
  set("resultReviewer", reviewer.value || "-");

  const risk = document.getElementById("risk");
  risk.className = "risk-badge " + getRiskClass(reba);
  risk.innerText = getRisk(reba);

  set("autoSummary", getSummary(reba));
  set("recommendation", getRecommendation(reba));

  document.getElementById("result").classList.remove("hidden");

  saveHistory({
    date: new Date().toLocaleDateString(),
    task: taskName.value,
    reviewer: reviewer.value,
    score: reba,
    risk: getRisk(reba)
  });
}

function saveHistory(data){
  let h=JSON.parse(localStorage.getItem("rebaHistory"))||[];
  h.unshift(data);
  localStorage.setItem("rebaHistory",JSON.stringify(h.slice(0,20)));
}

  set("autoSummary", getSummary(reba));
  set("recommendation", getRecommendation(reba));

  document.getElementById("result").classList.remove("hidden");
}

function set(id,val){
  const e=document.getElementById(id);
  if(e) e.innerText=val;
}

function getRisk(s){
  if(s<=3) return "Risiko Rendah";
  if(s<=6) return "Risiko Sedang";
  if(s<=9) return "Risiko Tinggi";
  return "Risiko Sangat Tinggi";
}

function getColor(s){
  if(s<=3) return "#2e7d32";
  if(s<=6) return "#f9a825";
  if(s<=9) return "#ef6c00";
  return "#c62828";
}

function getSummary(s){
  if(s<=3) return "Postur kerja dapat diterima.";
  if(s<=6) return "Perlu evaluasi postur kerja.";
  if(s<=9) return "Perbaikan ergonomi harus segera dilakukan.";
  return "Tindakan ergonomi wajib dilakukan sekarang.";
}

function getRecommendation(s){
  if(s<=3) return "Tidak diperlukan tindakan.";
  if(s<=6) return "Disarankan perbaikan dalam waktu dekat.";
  if(s<=9) return "Lakukan perbaikan secepatnya.";
  return "Hentikan pekerjaan dan redesign proses kerja.";
}

function resetForm(){
  location.reload();
}
document.querySelectorAll("select,input").forEach(el=>{
  el.addEventListener("change", calculateREBA);
});
const toggle = document.getElementById("themeToggle");

if(localStorage.getItem("theme")==="dark"){
  document.body.classList.add("dark");
}

toggle.onclick = ()=>{
  document.body.classList.toggle("dark");
  localStorage.setItem("theme",
    document.body.classList.contains("dark")?"dark":"light"
  );
};
/* =========================
   TABLE A (SIMPLIFIED STRUCTURE)
========================= */
function tableA(neck, trunk, legs){
  return neck + trunk + legs;
}

/* =========================
   TABLE B (SIMPLIFIED STRUCTURE)
========================= */
function tableB(upper, lower, wrist){
  return upper + lower + wrist;
}

/* =========================
   TABLE C (FINAL REBA)
========================= */
function tableC(scoreA, scoreB){
  return scoreA + scoreB;
}
function exportCSV(){
  const data = JSON.parse(localStorage.getItem("rebaHistory")) || [];
  if(!data.length){ alert("Belum ada data"); return; }

  let csv = "Tanggal,Task,Reviewer,Score,Risiko\n";
  data.forEach(d=>{
    csv += `${d.date},${d.task},${d.reviewer},${d.score},${d.risk}\n`;
  });

  const blob = new Blob([csv],{type:"text/csv"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "REBA_Report.csv";
  a.click();
}
