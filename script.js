/* =========================================================
   ISO REBA TABLE (Hignett & McAtamney)
========================================================= */
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

const clamp = (v,min,max)=>Math.max(min,Math.min(max,v));

/* =========================================================
   MULTI LANGUAGE (ID / EN / JP) — FULL
========================================================= */
const i18n = {
  id:{
    title:"ANALISA REBA", subtitle:"Rapid Entire Body Assessment",
    taskInfo:"Informasi Tugas", taskName:"Nama Tugas", reviewer:"Reviewer",
    upload:"Upload Foto Postur", photoHint:"Klik foto untuk menandai titik tubuh",
    additional:"Faktor Tambahan", calculate:"Hitung REBA",
    result:"Hasil Analisa", score:"Skor", risk:"Risiko",
    breakdown:"Breakdown Skor", summary:"Ringkasan Laporan",
    method:"Metode: REBA"
  },
  en:{
    title:"REBA Analysis", subtitle:"Rapid Entire Body Assessment",
    taskInfo:"Task Information", taskName:"Task Name", reviewer:"Reviewer",
    upload:"Upload Posture Photo", photoHint:"Click photo to mark body points",
    additional:"Additional Factors", calculate:"Calculate REBA",
    result:"Analysis Result", score:"Score", risk:"Risk",
    breakdown:"Score Breakdown", summary:"Report Summary",
    method:"Method: REBA"
  },
  jp:{
    title:"REBA分析", subtitle:"全身姿勢迅速評価",
    taskInfo:"作業情報", taskName:"作業名", reviewer:"評価者",
    upload:"姿勢写真アップロード", photoHint:"写真をクリックして点を付けます",
    additional:"追加要因", calculate:"REBA計算",
    result:"分析結果", score:"スコア", risk:"リスク",
    breakdown:"スコア内訳", summary:"レポート概要",
    method:"方法：REBA"
  }
};

document.getElementById("langSelect").addEventListener("change", e=>{
  const lang = e.target.value;
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const key = el.dataset.i18n;
    if(i18n[lang][key]) el.textContent = i18n[lang][key];
  });
});

/* =========================================================
   PHOTO UPLOAD + CANVAS (FIXED)
========================================================= */
const photoInput = document.getElementById("photoInput");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let img = new Image();

photoInput.addEventListener("change", e=>{
  const file = e.target.files[0];
  if(!file) return;

  const reader = new FileReader();
  reader.onload = ()=>{
    img.onload = ()=>{
      const maxW = canvas.parentElement.clientWidth;
      const scale = Math.min(1, maxW / img.width);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.drawImage(img,0,0,canvas.width,canvas.height);
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
});

canvas.addEventListener("click", e=>{
  const r = canvas.getBoundingClientRect();
  const x = e.clientX - r.left;
  const y = e.clientY - r.top;
  ctx.fillStyle="red";
  ctx.beginPath();
  ctx.arc(x,y,5,0,Math.PI*2);
  ctx.fill();
});

/* =========================================================
   STEP HIGHLIGHT
========================================================= */
function highlight(select){
  select.classList.remove("low","medium","high");
  if(select.value>=3) select.classList.add("high");
  else if(select.value==2) select.classList.add("medium");
  else if(select.value==1) select.classList.add("low");
}

document.querySelectorAll("select").forEach(s=>{
  s.addEventListener("change",()=>highlight(s));
});

/* =========================================================
   CORE CALCULATION (ISO SAFE)
========================================================= */
function calculateREBA(){
  const v=id=>Number(document.getElementById(id).value);

  let neck=v("neck"), trunk=v("trunk"), legs=v("legs"),
      upper=v("upperArm"), lower=v("lowerArm"), wrist=v("wrist");

  if(![neck,trunk,legs,upper,lower,wrist].every(n=>n>0)){
    alert("Lengkapi semua penilaian postur terlebih dahulu");
    return;
  }

  const load=v("load"), coupling=v("coupling"), activity=v("activity");

  const scoreA = tableA[neck-1][trunk-1][legs-1] + load;
  const scoreB = tableB[upper-1][lower-1][wrist-1] + coupling;
  const finalScore =
    tableC[clamp(scoreA,1,8)-1][clamp(scoreB,1,7)-1] + activity;

  document.getElementById("finalScore").textContent = finalScore;
  document.getElementById("scoreA").textContent = scoreA;
  document.getElementById("scoreB").textContent = scoreB;
  document.getElementById("scoreC").textContent = finalScore;

  let riskTxt, riskCls;
  if(finalScore<=3){riskTxt="Low";riskCls="risk-low";}
  else if(finalScore<=7){riskTxt="Medium";riskCls="risk-medium";}
  else if(finalScore<=10){riskTxt="High";riskCls="risk-high";}
  else{riskTxt="Very High";riskCls="risk-very-high";}

  const riskEl=document.getElementById("riskLabel");
  riskEl.textContent=riskTxt;
  riskEl.className="risk-box "+riskCls;

  document.getElementById("reportTask").textContent =
    document.getElementById("taskNameInput").value || "-";
  document.getElementById("reportReviewer").textContent =
    document.getElementById("reviewerInput").value || "-";

  document.getElementById("result").classList.remove("hidden");
}

/* =========================================================
   INIT
========================================================= */
document.getElementById("reportDate").textContent =
  new Date().toLocaleDateString();
