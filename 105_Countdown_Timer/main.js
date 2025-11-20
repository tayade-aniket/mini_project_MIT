let totalSeconds = 0,
  interval;
function updateDisplay() {
  let m = Math.floor(totalSeconds / 60),
    s = totalSeconds % 60;
  document.getElementById("display").textContent =
    (m < 10 ? "0" + m : m) + ":" + (s < 10 ? "0" + s : s);
}
function startTimer() {
  let m = parseInt(document.getElementById("minutes").value) || 0;
  let s = parseInt(document.getElementById("seconds").value) || 0;
  if (totalSeconds === 0) totalSeconds = m * 60 + s;
  clearInterval(interval);
  interval = setInterval(() => {
    if (totalSeconds <= 0) {
      clearInterval(interval);
    } else {
      totalSeconds--;
      updateDisplay();
    }
  }, 1000);
}
function pauseTimer() {
  clearInterval(interval);
}
function resetTimer() {
  clearInterval(interval);
  totalSeconds = 0;
  updateDisplay();
}
updateDisplay();
