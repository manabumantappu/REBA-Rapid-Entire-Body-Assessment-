/* ================= ISO REBA TABLE ================= */
const tableA=[
[[1,2,3,4],[2,3,4,5],[3,4,5,6],[4,5,6,7],[5,6,7,8]],
[[2,3,4,5],[3,4,5,6],[4,5,6,7],[5,6,7,8],[6,7,8,9]],
[[3,4,5,6],[4,5,6,7],[5,6,7,8],[6,7,8,9],[7,8,9,10]]
];
const tableB=[
[[1,2,3],[2,3,4]],
[[2,3,4],[3,4,5]],
[[3,4,5],[4,5,6]]
];
const tableC=[
[1,2,3,4,5,6,7],
[2,3,4,5,6,7,8],
[3,4,5,6,7,8,9],
[4,5,6,7,8,9,10],
[5,6,7,8,9,10,11],
[6,7,8,9,10,11,12],
[7,8,9,10,11,12,13],
[8,9,10,11,12,13,14]
];

const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));

/* ================= CALCULATE ================= */
function calculateREBA(){
  const v=id=>Number(document.getElementById(id).value);

  let neck=v("neck"),trunk=v("trunk"),legs=v("legs"),
      upper=v("upperArm"),lower=v("lowerArm"),wrist=v("wrist");

  if(![neck,trunk,legs,upper,lower,wrist].every(n=>n>0)){
    alert("Lengkapi semua input");
    return;
  }

  const load=v("load"),coupling=v("coupling"),activity=v("activity");

  const scoreA=tableA[neck-1][trunk-1][legs-1]+load;
  const scoreB=tableB[upper-1][lower-1][wrist-1]+coupling;
  const finalScore=tableC[clamp(scoreA,1,8)-1][clamp(scoreB,1,7)-1]+activity;

  document.getElementById("score").textContent=finalScore;
  document.getElementById("scoreA").textContent=scoreA;
  document.getElementById("scoreB").textContent=scoreB;
  document.getElementById("scoreC").textContent=finalScore;

  let risk="",rec="",cls="";
  if(finalScore<=3){risk="Low";cls="risk-low";}
  else if(finalScore<=7){risk="Medium";cls="risk-medium";}
  else if(finalScore<=10){risk="High";cls="risk-high";}
  else{risk="Very High";cls="risk-very-high";}

  const riskEl=document.getElementById("risk");
  riskEl.textContent=risk;
  riskEl.className="risk-box "+cls;

  document.getElementById("recommendation").textContent=
    risk==="Low"?"Monitor":
    risk==="Medium"?"Investigate":
    risk==="High"?"Action required":"Immediate action";

  document.getElementById("reportTask").textContent=
    document.getElementById("taskName").value||"-";
  document.getElementById("reportReviewer").textContent=
    document.getElementById("reviewer").value||"-";

  document.getElementById("result").classList.remove("hidden");
}

/* ================= MULTI LANGUAGE ================= */
const i18n={
id:{title:"ANALISA REBA",calculate:"Hitung REBA"},
en:{title:"REBA ANALYSIS",calculate:"Calculate REBA"},
jp:{title:"REBA分析",calculate:"REBA計算"}
};
document.getElementById("langSelect").onchange=e=>{
  const lang=e.target.value;
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const k=el.dataset.i18n;
    if(i18n[lang][k]) el.textContent=i18n[lang][k];
  });
};

document.getElementById("reportDate").textContent=
  new Date().toLocaleDateString();
