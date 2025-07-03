

document.getElementById('registerForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  const role = document.getElementById('role').value;

  // Validate form fields
  if (!name || !email || !password || !confirmPassword || !role) {
    alert("Please fill in all fields.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  // Check if the email is already registered
  const existingUser = JSON.parse(localStorage.getItem(`${role}_${email}`));
  if (existingUser) {
    alert("This email is already registered. Please use a different email.");
    return;
  }

  // Generate a unique ID for the user
  function generateId() {
    return 'u_' + Math.random().toString(36).substr(2, 9);
  }

  // Create user object with id
  const user = {
    id: generateId(),
    name: name,
    email: email,
    password: password,
    role: role,
  };

  // Save the user object in localStorage
  localStorage.setItem(`${role}_${email}`, JSON.stringify(user));

  alert("Registration successful! You can now log in.");

  // Redirect to login page
  window.location.href = 'login.html';
});
