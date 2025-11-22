const input = document.getElementById("textInput");
const img = document.getElementById("qrImage");
const btn = document.getElementById("generateBtn");

btn.addEventListener("click", () => {
    if (input.value.trim() !== "") {
        img.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${input.value}`;
        img.style.display = "block";
    } else {
        img.style.display = "none";
        alert("Please enter some text!");
    }
});
