function calculateREBA() {
  const neck = +document.getElementById("neck").value;
  const trunk = +document.getElementById("trunk").value;
  const legs = +document.getElementById("legs").value;

  const upperArm = +document.getElementById("upperArm").value;
  const lowerArm = +document.getElementById("lowerArm").value;
  const wrist = +document.getElementById("wrist").value;

  const load = +document.getElementById("load").value;
  const activity = +document.getElementById("activity").value;

  // Simplified REBA logic (educational)
  const scoreA = neck + trunk + legs + load;
  const scoreB = upperArm + lowerArm + wrist;
  const total = scoreA + scoreB + activity;

  let risk = "";
  let recommendation = "";

  if (total <= 3) {
    risk = "Sangat Rendah";
    recommendation = "Postur dapat diterima.";
  } else if (total <= 7) {
    risk = "Sedang";
    recommendation = "Perlu evaluasi dan perbaikan.";
  } else if (total <= 10) {
    risk = "Tinggi";
    recommendation = "Perlu perbaikan segera.";
  } else {
    risk = "Sangat Tinggi";
    recommendation = "Tindakan ergonomi harus dilakukan sekarang.";
  }

  document.getElementById("score").textContent = total;
  document.getElementById("risk").textContent = risk;
  document.getElementById("recommendation").textContent = recommendation;

  document.getElementById("result").classList.remove("hidden");
}

function resetForm() {
  document.querySelectorAll("select").forEach(s => s.selectedIndex = 0);
  document.getElementById("result").classList.add("hidden");
}
