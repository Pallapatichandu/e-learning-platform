document.getElementById('forgotForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const newPassword = document.getElementById('newPassword').value.trim();
  const role = document.getElementById('role').value;
  const message = document.getElementById('message');

  if (!email || !newPassword || !role) {
    message.textContent = "Please fill all fields.";
    message.style.color = "red";
    return;
  }

  const userKey = `${role}_${email}`;
  const storedUser = JSON.parse(localStorage.getItem(userKey));

  if (storedUser) {
    storedUser.password = newPassword;
    localStorage.setItem(userKey, JSON.stringify(storedUser));
    message.textContent = "✅ Password updated successfully!";
    message.style.color = "green";
  } else {
    message.textContent = "❌ User not found. Please register.";
    message.style.color = "red";
  }
});
