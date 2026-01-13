function v(id){
  return parseInt(document.getElementById(id)?.value) || 0;
}

function calculateREBA(){

  const scoreA = v("neck")+v("trunk")+v("legs")+v("load");
  const scoreB = v("upperArm")+v("lowerArm")+v("wrist")+v("coupling");
  const reba   = scoreA + scoreB + v("activity");

  set("scoreA", scoreA);
  set("scoreB", scoreB);
  set("score", reba);

  set("resultTask", document.getElementById("taskName").value || "-");
  set("resultReviewer", document.getElementById("reviewer").value || "-");

  const risk = document.getElementById("risk");
  risk.innerText = getRisk(reba);
  risk.style.background = getColor(reba);
  risk.style.color = "#fff";

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
