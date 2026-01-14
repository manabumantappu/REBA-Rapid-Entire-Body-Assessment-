const tableA=[[[1,2,3,4],[2,3,4,5],[3,4,5,6],[4,5,6,7],[5,6,7,8]],
              [[2,3,4,5],[3,4,5,6],[4,5,6,7],[5,6,7,8],[6,7,8,9]],
              [[3,4,5,6],[4,5,6,7],[5,6,7,8],[6,7,8,9],[7,8,9,10]]];
const tableB=[[[1,2,3],[2,3,4]],[[2,3,4],[3,4,5]],[[3,4,5],[4,5,6]]];
const tableC=[[1,2,3,4,5,6,7],[2,3,4,5,6,7,8],[3,4,5,6,7,8,9],[4,5,6,7,8,9,10],[5,6,7,8,9,10,11],[6,7,8,9,10,11,12],[7,8,9,10,11,12,13],[8,9,10,11,12,13,14]];
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));

function highlight(select){
  select.classList.remove("low","medium","high");
  if(select.value>=3) select.classList.add("high");
  else if(select.value==2) select.classList.add("medium");
  else if(select.value==1) select.classList.add("low");
}

document.querySelectorAll("select").forEach(s=>{
  s.addEventListener("change",()=>highlight(s));
});

function calculateREBA(){
  const v=id=>Number(document.getElementById(id).value);
  let n=v("neck"),t=v("trunk"),l=v("legs"),u=v("upperArm"),lo=v("lowerArm"),w=v("wrist");
  if(![n,t,l,u,lo,w].every(x=>x>0)){alert("Lengkapi semua");return;}

  const scoreA=tableA[n-1][t-1][l-1]+v("load");
  const scoreB=tableB[u-1][lo-1][w-1]+v("coupling");
  const final=tableC[clamp(scoreA,1,8)-1][clamp(scoreB,1,7)-1]+v("activity");

  score.textContent=final;
  scoreAEl.textContent=scoreA;
  scoreBEl.textContent=scoreB;
  scoreCEl.textContent=final;

  let cls=final<=3?"risk-low":final<=7?"risk-medium":final<=10?"risk-high":"risk-very-high";
  risk.textContent=final<=3?"Low":final<=7?"Medium":final<=10?"High":"Very High";
  risk.className="risk-box "+cls;

  result.classList.remove("hidden");
}
