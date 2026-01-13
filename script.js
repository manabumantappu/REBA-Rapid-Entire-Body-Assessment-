const $=id=>document.getElementById(id);
const v=id=>parseInt($(id)?.value)||0;

/* DARK MODE */
if(localStorage.theme==="dark")document.body.classList.add("dark");
$("themeToggle").onclick=()=>{
  document.body.classList.toggle("dark");
  localStorage.theme=document.body.classList.contains("dark")?"dark":"light";
};

/* CORE REBA */
function calculateREBA(){
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
}

function riskText(s){
  if(s===1)return"Action Level 0 – Dapat diabaikan";
  if(s<=3)return"Action Level 1 – Risiko rendah";
  if(s<=7)return"Action Level 2 – Risiko sedang";
  if(s<=10)return"Action Level 3 – Risiko tinggi";
  return"Action Level 4 – Risiko sangat tinggi";
}
function summaryText(s){
  if(s<=1)return"Tidak diperlukan tindakan.";
  if(s<=3)return"Monitoring disarankan.";
  if(s<=7)return"Perlu perbaikan ergonomi.";
  if(s<=10)return"Perbaikan harus segera dilakukan.";
  return"Tindakan segera wajib.";
}
function recommendationText(s){
  if(s<=1)return"Postur dapat diterima.";
  if(s<=3)return"Perbaikan minor jika memungkinkan.";
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
