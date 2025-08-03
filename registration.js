"use strict";

let qString = location.search.slice(1);
qString = qString.replace(/\+/g, " ");
qString = decodeURIComponent(qString);

let formData = qString.split("&");

for (let item of formData) {
  let [fieldName, fieldValue] = item.split("=");

  let label = document.createElement("label");
  label.textContent = fieldName;
  document.getElementById("contactInfo").appendChild(label);

  let input = document.createElement("input");
  input.id = fieldName;
  input.name = fieldName;
  input.value = fieldValue;
  input.disabled = true;
  document.getElementById("contactInfo").appendChild(input);
}

document.getElementById("confirmBtn").onclick = function () {
  let inputs = document.querySelectorAll("#contactInfo input");
  for (let field of inputs) {
    localStorage.setItem(field.name, field.value);
  }
  alert("Registration data saved to local storage.");
};
