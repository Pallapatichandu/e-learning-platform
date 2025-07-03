



document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const role = document.getElementById('login-role').value;

  const storedUser = JSON.parse(localStorage.getItem(`${role}_${email}`));

  if (!storedUser) {
    alert('User not found or incorrect role selected.');
    return;
  }

  if (storedUser.password !== password) {
    alert('Incorrect password.');
    return;
  }

  // ✅ Save user session data
  localStorage.setItem('currentUser', JSON.stringify(storedUser));

  // ✅ Save studentId separately for video loading
  if (role === 'student') {
    localStorage.setItem('studentId', storedUser.id);
  }

  alert(`Welcome, ${storedUser.name}! Redirecting to your dashboard...`);

  // Redirect
  if (role === 'student') {
    window.location.href = 'student-dashboard.html';
  } else if (role === 'instructor') {
    window.location.href = 'instructor-dashboard.html';
  }
});
