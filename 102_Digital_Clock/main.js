function pad(n) {
  return n < 10 ? "0" + n : String(n);
}
function updateClock() {
  const now = new Date();
  let h = now.getHours();
  const m = now.getMinutes();
  const s = now.getSeconds();
  const ampm = h >= 12 ? "PM" : "AM";
  if (h === 0) {
    h = 12;
  } else if (h > 12) {
    h = h - 12;
  }
  document.getElementById("hours").textContent = pad(h);
  document.getElementById("minutes").textContent = pad(m);
  document.getElementById("seconds").textContent = pad(s);
  document.getElementById("ampm").textContent = ampm;
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  document.getElementById("dayName").textContent = dayNames[now.getDay()];
  document.getElementById("month").textContent = monthNames[now.getMonth()];
  document.getElementById("dayNum").textContent = pad(now.getDate());
  document.getElementById("year").textContent = now.getFullYear();
}
updateClock();
setInterval(updateClock, 1000);
