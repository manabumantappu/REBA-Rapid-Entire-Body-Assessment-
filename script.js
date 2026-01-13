const $=id=>document.getElementById(id);
const v=id=>parseInt($(id)?.value)||0;

document.querySelectorAll("select").forEach(e=>{
  e.addEventListener("change", calculateREBA);
});

function calculateREBA(){

  // STEP SCORE
  $("sNeck").innerText=v("neck");
  $("sTrunk").innerText=v("trunk");
  $("sLegs").innerText=v("legs");
  $("sUpper").innerText=v("upperArm");
  $("sLower").innerText=v("lowerArm");
  $("sWrist").innerText=v("wrist");

  // GROUP SCORE
  const A = v("neck")+v("trunk")+v("legs")+v("load");
  const B = v("upperArm")+v("lowerArm")+v("wrist")+v("coupling");
  const R = A+B+v("activity");

  $("scoreA").innerText=A;
  $("scoreB").innerText=B;
  $("score").innerText=R;

  $("rTask").innerText=$("taskName").value||"-";
  $("rReviewer").innerText=$("reviewer").value||"-";

  const risk=$("risk");
  risk.className="risk-badge "+riskClass(R);
  risk.innerText=riskText(R);

  $("summary").innerText=summaryText(R);
  $("recommendation").innerText=recommendationText(R);

  $("result").classList.remove("hidden");
  highlightSteps();
}

function highlightSteps(){
  document.querySelectorAll(".step").forEach(s=>s.classList.remove("active"));
  document.querySelectorAll(".step").forEach(s=>s.classList.add("active"));
}

function riskText(s){
  if(s<=3)return"Action Level 1 – Risiko rendah";
  if(s<=7)return"Action Level 2 – Risiko sedang";
  if(s<=10)return"Action Level 3 – Risiko tinggi";
  return"Action Level 4 – Risiko sangat tinggi";
}
function summaryText(s){
  if(s<=3)return"Monitoring disarankan.";
  if(s<=7)return"Perlu perbaikan ergonomi.";
  if(s<=10)return"Perbaikan segera.";
  return"Tindakan segera wajib.";
}
function recommendationText(s){
  if(s<=3)return"Postur masih dapat diterima.";
  if(s<=7)return"Redesign metode kerja.";
  if(s<=10)return"Redesign workstation segera.";
  return"Hentikan pekerjaan sampai aman.";
}
function riskClass(s){
  if(s<=3)return"risk-low";
  if(s<=7)return"risk-mid";
  if(s<=10)return"risk-high";
  return"risk-extreme";
}
function resetForm(){location.reload();}
