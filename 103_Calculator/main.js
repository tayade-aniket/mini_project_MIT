function insert(num) {
  document.getElementById("result").value += num;
}
function clearResult() {
  document.getElementById("result").value = "";
}
function deleteLast() {
  var val = document.getElementById("result").value;
  document.getElementById("result").value = val.slice(0, -1);
}
function calculate() {
  var exp = document.getElementById("result").value;
  if (exp) document.getElementById("result").value = eval(exp);
}
