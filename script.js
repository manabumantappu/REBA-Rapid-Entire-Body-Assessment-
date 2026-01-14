const tableA=[[[1,2,3,4],[2,3,4,5],[3,4,5,6],[4,5,6,7],[5,6,7,8]],
              [[2,3,4,5],[3,4,5,6],[4,5,6,7],[5,6,7,8],[6,7,8,9]],
              [[3,4,5,6],[4,5,6,7],[5,6,7,8],[6,7,8,9],[7,8,9,10]]];
const tableB=[[[1,2,3],[2,3,4]],[[2,3,4],[3,4,5]],[[3,4,5],[4,5,6]]];
const tableC=[[1,2,3,4,5,6,7],[2,3,4,5,6,7,8],[3,4,5,6,7,8,9],[4,5,6,7,8,9,10],[5,6,7,8,9,10,11],[6,7,8,9,10,11,12],[7,8,9,10,11,12,13],[8,9,10,11,12,13,14]];

const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));

function fill(id,arr){
  const s=document.getElementById(id);
  s.innerHTML='<option value="">--</option>';
  arr.forEach(o=>{
    const op=document.createElement("option");
    op.value=o.v;op.textContent=o.t;
    s.appendChild(op);
  });
}

fill("neck",[{v:1,t:"Neutral"},{v:2,t:"Flex"},{v:3,t:"Twist"}]);
fill("trunk",[{v:1,t:"Upright"},{v:2,t:"Mild flex"},{v:3,t:"Moderate flex"},{v:4,t:"Severe flex"},{v:5,t:"Extend"}]);
fill("legs",[{v:1,t:"Both feet"},{v:2,t:"One leg"},{v:3,t:"Moving"},{v:4,t:"Squatting"}]);
fill("upperArm",[{v:1,t:"Neutral"},{v:2,t:"Raised"},{v:3,t:"Above shoulder"}]);
fill("lowerArm",[{v:1,t:"60–100°"},{v:2,t:"<60° or >100°"}]);
fill("wrist",[{v:1,t:"Neutral"},{v:2,t:"Bent"}]);

function highlight(s){
  s.classList.remove("low","medium","high");
  if(s.value>=3)s.classList.add("high");
  else if(s.value==2)s.classList.add("medium");
  else if(s.value==1)s.classList.add("low");
}
document.querySelectorAll("select").forEach(s=>s.onchange=()=>highlight(s));

function calculateREBA(){
  const v=id=>Number(document.getElementById(id).value);
  let n=v("neck"),t=v("trunk"),l=v("legs"),u=v("upperArm"),lo=v("lowerArm"),w=v("wrist");
  if(![n,t,l,u,lo,w].every(x=>x>0)){alert("Lengkapi semua");return;}

  const A=tableA[n-1][t-1][l-1]+v("load");
  const B=tableB[u-1][lo-1][w-1]+v("coupling");
  const F=tableC[clamp(A,1,8)-1][clamp(B,1,7)-1]+v("activity");

  finalScore.textContent=F;
  scoreA.textContent=A;
  scoreB.textContent=B;
  scoreC.textContent=F;

  let txt,cls;
  if(F<=3){txt="Low";cls="risk-low";}
  else if(F<=7){txt="Medium";cls="risk-medium";}
  else if(F<=10){txt="High";cls="risk-high";}
  else{txt="Very High";cls="risk-very-high";}

  riskLabel.textContent=txt;
  riskLabel.className="risk-box "+cls;
  result.classList.remove("hidden");
}
