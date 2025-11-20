function calculateTip() {
  let bill = parseFloat(document.getElementById("bill").value);
  let percent = parseFloat(document.getElementById("tipPercent").value);
  if (!bill) return;
  let tip = (bill * percent) / 100;
  let total = bill + tip;
  document.getElementById("tipAmount").textContent = "₹" + tip.toFixed(2);
  document.getElementById("totalAmount").textContent = "₹" + total.toFixed(2);
}
