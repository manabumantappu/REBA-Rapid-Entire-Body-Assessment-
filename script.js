const $=id=>document.getElementById(id);
const v=id=>parseInt($(id).value)||0;

/* ================= LANGUAGE ================= */
const T={
 id:{title:"ANALISA REBA",subtitle:"Penilaian Postur Tubuh",
     info:"Informasi Penilaian",task:"Task / Pekerjaan",reviewer:"Reviewer / Penilai"},
 en:{title:"REBA ANALYSIS",subtitle:"Rapid Entire Body Assessment",
     info:"Assessment Info",task:"Task",reviewer:"Reviewer"},
 jp:{title:"REBA分析",subtitle:"全身作業姿勢評価",
     info:"評価情報",task:"作業内容",reviewer:"評価者"}
};

function setLang(l){
 document.querySelectorAll("[data-i18n]").forEach(e=>{
  const k=e.dataset.i18n;
  if(T[l][k]) e.innerText=T[l][k];
 });
}

/* ================= DARK MODE ================= */
if(localStorage.theme==="dark") document.body.classList.add("dark");
$("themeToggle").onclick=()=>{
 document.body.classList.toggle("dark");
 localStorage.theme=document.body.classList.contains("dark")?"dark":"light";
};

/* ================= AUTO SCORE ================= */
document.querySelectorAll("select").forEach(e=>{
 e.addEventListener("change",calculateREBA);
});

function calculateREBA(){
 const A=v("neck")+v("trunk")+v("legs");
 const B=v("upperArm")+v("lowerArm")+v("wrist");
 const R=A+B;

 $("sNeck").innerText=v("neck");
 $("sTrunk").innerText=v("trunk");
 $("sLegs").innerText=v("legs");
 $("sUpper").innerText=v("upperArm");
 $("sLower").innerText=v("lowerArm");
 $("sWrist").innerText=v("wrist");

 $("scoreA").innerText=A;
 $("scoreB").innerText=B;
 $("score").innerText=R;

 highlightSteps();

 const risk=$("risk");
 risk.className="risk-badge "+riskClass(R);
 risk.innerText=riskText(R);
}

function highlightSteps(){
 document.querySelectorAll(".step").forEach(s=>s.classList.remove("active"));
 document.querySelectorAll(".step").forEach(s=>s.classList.add("active"));
}

function riskText(s){
 if(s<=3)return"Action Level 1 – Low Risk";
 if(s<=7)return"Action Level 2 – Medium Risk";
 if(s<=10)return"Action Level 3 – High Risk";
 return"Action Level 4 – Very High Risk";
}
function riskClass(s){
 if(s<=3)return"risk-low";
 if(s<=7)return"risk-mid";
 if(s<=10)return"risk-high";
 return"risk-extreme";
}
