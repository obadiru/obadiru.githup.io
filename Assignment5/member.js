

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("registrationForm");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const fullname = document.getElementById("fullname").value.trim();
    const email = document.getElementById("email").value.trim();
    const province = document.getElementById("province").value.trim().toUpperCase();
    const postalcode = document.getElementById("postalcode").value.trim();
    const age = parseInt(document.getElementById("age").value);
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    const postalRegex = /^[A-Za-z]\d[A-Za-z]\d[A-Za-z]\d$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    const validProvinces = ["QC", "ON", "MN", "SK", "AB", "BC"];

    if (!fullname || !email || !province || !postalcode || !age || !password || !confirmPassword) {
      alert("All fields are required.");
      return;
    }

    if (!postalRegex.test(postalcode)) {
      alert("Invalid postal code format. Use A1A1A1 format.");
      return;
    }

    if (!validProvinces.includes(province)) {
      alert("Province must be one of QC, ON, MN, SK, AB, BC.");
      return;
    }

    if (age < 18) {
      alert("You must be at least 18 years old.");
      return;
    }

    if (!emailRegex.test(email)) {
      alert("Invalid email format.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (!passwordRegex.test(password)) {
      alert("Password must have at least 6 characters, one uppercase letter, and one digit.");
      return;
    }

    alert("Thanks for registering with our website, your customer record was created successfully.");
    form.reset();
  });
});
